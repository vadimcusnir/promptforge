-- Migration: Payment Analytics and Monitoring
-- Creates tables for payment event tracking, analytics, and monitoring

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create payment events table for comprehensive tracking
CREATE TABLE IF NOT EXISTS payment_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'checkout_started',
        'checkout_completed', 
        'checkout_failed',
        'subscription_created',
        'subscription_updated',
        'subscription_cancelled',
        'payment_succeeded',
        'payment_failed',
        'trial_started',
        'trial_ended',
        'plan_upgraded',
        'plan_downgraded',
        'refund_processed',
        'chargeback_received'
    )),
    user_id UUID NOT NULL,
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    plan_id TEXT NOT NULL CHECK (plan_id IN ('pilot', 'pro', 'enterprise')),
    amount DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    stripe_event_id TEXT,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    metadata JSONB DEFAULT '{}',
    session_id TEXT,
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create payment metrics table for aggregated data
CREATE TABLE IF NOT EXISTS payment_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    new_subscriptions INTEGER DEFAULT 0,
    cancelled_subscriptions INTEGER DEFAULT 0,
    active_subscriptions INTEGER DEFAULT 0,
    churn_rate DECIMAL(5,2) DEFAULT 0,
    mrr DECIMAL(12,2) DEFAULT 0, -- Monthly Recurring Revenue
    arr DECIMAL(12,2) DEFAULT 0, -- Annual Recurring Revenue
    average_revenue_per_user DECIMAL(10,2) DEFAULT 0,
    conversion_rate DECIMAL(5,2) DEFAULT 0,
    plan_breakdown JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(date)
);

-- Create payment alerts table for monitoring
CREATE TABLE IF NOT EXISTS payment_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_type TEXT NOT NULL CHECK (alert_type IN (
        'high_churn_rate',
        'payment_failure_spike',
        'revenue_drop',
        'conversion_rate_drop',
        'webhook_failure',
        'stripe_api_error'
    )),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMPTZ,
    resolved_by UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_events_user_id ON payment_events(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_org_id ON payment_events(org_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_event_type ON payment_events(event_type);
CREATE INDEX IF NOT EXISTS idx_payment_events_plan_id ON payment_events(plan_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_created_at ON payment_events(created_at);
CREATE INDEX IF NOT EXISTS idx_payment_events_stripe_event_id ON payment_events(stripe_event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_stripe_subscription_id ON payment_events(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_payment_metrics_date ON payment_metrics(date);
CREATE INDEX IF NOT EXISTS idx_payment_metrics_mrr ON payment_metrics(mrr);
CREATE INDEX IF NOT EXISTS idx_payment_metrics_churn_rate ON payment_metrics(churn_rate);

CREATE INDEX IF NOT EXISTS idx_payment_alerts_alert_type ON payment_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_payment_alerts_severity ON payment_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_payment_alerts_is_resolved ON payment_alerts(is_resolved);
CREATE INDEX IF NOT EXISTS idx_payment_alerts_created_at ON payment_alerts(created_at);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_payment_metrics_updated_at 
    BEFORE UPDATE ON payment_metrics 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate daily payment metrics
CREATE OR REPLACE FUNCTION calculate_daily_payment_metrics(target_date DATE)
RETURNS VOID AS $$
DECLARE
    v_total_revenue DECIMAL(12,2) := 0;
    v_new_subscriptions INTEGER := 0;
    v_cancelled_subscriptions INTEGER := 0;
    v_active_subscriptions INTEGER := 0;
    v_mrr DECIMAL(12,2) := 0;
    v_arr DECIMAL(12,2) := 0;
    v_plan_breakdown JSONB := '{}';
    v_plan_stats RECORD;
BEGIN
    -- Calculate total revenue for the day
    SELECT COALESCE(SUM(amount), 0) INTO v_total_revenue
    FROM payment_events
    WHERE DATE(created_at) = target_date
    AND event_type = 'payment_succeeded';

    -- Calculate new subscriptions
    SELECT COUNT(*) INTO v_new_subscriptions
    FROM payment_events
    WHERE DATE(created_at) = target_date
    AND event_type = 'subscription_created';

    -- Calculate cancelled subscriptions
    SELECT COUNT(*) INTO v_cancelled_subscriptions
    FROM payment_events
    WHERE DATE(created_at) = target_date
    AND event_type = 'subscription_cancelled';

    -- Calculate active subscriptions (simplified - in production you'd want more sophisticated logic)
    SELECT COUNT(DISTINCT stripe_subscription_id) INTO v_active_subscriptions
    FROM payment_events
    WHERE stripe_subscription_id IS NOT NULL
    AND created_at <= (target_date + INTERVAL '1 day')
    AND (stripe_subscription_id NOT IN (
        SELECT DISTINCT stripe_subscription_id
        FROM payment_events
        WHERE event_type = 'subscription_cancelled'
        AND DATE(created_at) <= target_date
    ) OR stripe_subscription_id IN (
        SELECT DISTINCT stripe_subscription_id
        FROM payment_events
        WHERE event_type = 'subscription_created'
        AND DATE(created_at) > (
            SELECT MAX(DATE(created_at))
            FROM payment_events
            WHERE event_type = 'subscription_cancelled'
            AND stripe_subscription_id = payment_events.stripe_subscription_id
        )
    ));

    -- Calculate MRR (simplified calculation)
    SELECT COALESCE(SUM(
        CASE 
            WHEN plan_id = 'pro' THEN 49
            WHEN plan_id = 'enterprise' THEN 299
            ELSE 0
        END
    ), 0) INTO v_mrr
    FROM payment_events
    WHERE event_type = 'subscription_created'
    AND DATE(created_at) <= target_date
    AND stripe_subscription_id NOT IN (
        SELECT DISTINCT stripe_subscription_id
        FROM payment_events
        WHERE event_type = 'subscription_cancelled'
        AND DATE(created_at) <= target_date
    );

    -- Calculate ARR (12 * MRR)
    v_arr := v_mrr * 12;

    -- Calculate plan breakdown
    FOR v_plan_stats IN
        SELECT 
            plan_id,
            COUNT(*) as count,
            SUM(COALESCE(amount, 0)) as revenue
        FROM payment_events
        WHERE DATE(created_at) = target_date
        AND event_type = 'subscription_created'
        GROUP BY plan_id
    LOOP
        v_plan_breakdown := v_plan_breakdown || jsonb_build_object(
            v_plan_stats.plan_id,
            jsonb_build_object(
                'count', v_plan_stats.count,
                'revenue', v_plan_stats.revenue
            )
        );
    END LOOP;

    -- Upsert daily metrics
    INSERT INTO payment_metrics (
        date,
        total_revenue,
        new_subscriptions,
        cancelled_subscriptions,
        active_subscriptions,
        churn_rate,
        mrr,
        arr,
        average_revenue_per_user,
        conversion_rate,
        plan_breakdown
    ) VALUES (
        target_date,
        v_total_revenue,
        v_new_subscriptions,
        v_cancelled_subscriptions,
        v_active_subscriptions,
        CASE 
            WHEN v_active_subscriptions > 0 
            THEN (v_cancelled_subscriptions::DECIMAL / v_active_subscriptions) * 100
            ELSE 0
        END,
        v_mrr,
        v_arr,
        CASE 
            WHEN v_active_subscriptions > 0 
            THEN v_total_revenue / v_active_subscriptions
            ELSE 0
        END,
        0, -- Conversion rate would need more complex calculation
        v_plan_breakdown
    )
    ON CONFLICT (date) DO UPDATE SET
        total_revenue = EXCLUDED.total_revenue,
        new_subscriptions = EXCLUDED.new_subscriptions,
        cancelled_subscriptions = EXCLUDED.cancelled_subscriptions,
        active_subscriptions = EXCLUDED.active_subscriptions,
        churn_rate = EXCLUDED.churn_rate,
        mrr = EXCLUDED.mrr,
        arr = EXCLUDED.arr,
        average_revenue_per_user = EXCLUDED.average_revenue_per_user,
        conversion_rate = EXCLUDED.conversion_rate,
        plan_breakdown = EXCLUDED.plan_breakdown,
        updated_at = NOW();

END;
$$ LANGUAGE plpgsql;

-- Create function to detect payment anomalies and create alerts
CREATE OR REPLACE FUNCTION detect_payment_anomalies()
RETURNS VOID AS $$
DECLARE
    v_high_churn_rate BOOLEAN := false;
    v_payment_failure_spike BOOLEAN := false;
    v_revenue_drop BOOLEAN := false;
    v_today_metrics RECORD;
    v_yesterday_metrics RECORD;
    v_avg_churn_rate DECIMAL(5,2);
    v_avg_revenue DECIMAL(12,2);
BEGIN
    -- Get today's metrics
    SELECT * INTO v_today_metrics
    FROM payment_metrics
    WHERE date = CURRENT_DATE;

    -- Get yesterday's metrics
    SELECT * INTO v_yesterday_metrics
    FROM payment_metrics
    WHERE date = CURRENT_DATE - INTERVAL '1 day';

    -- Get average churn rate over last 7 days
    SELECT AVG(churn_rate) INTO v_avg_churn_rate
    FROM payment_metrics
    WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND date < CURRENT_DATE;

    -- Get average revenue over last 7 days
    SELECT AVG(total_revenue) INTO v_avg_revenue
    FROM payment_metrics
    WHERE date >= CURRENT_DATE - INTERVAL '7 days'
    AND date < CURRENT_DATE;

    -- Check for high churn rate (more than 2x average)
    IF v_today_metrics.churn_rate > (v_avg_churn_rate * 2) AND v_today_metrics.churn_rate > 10 THEN
        INSERT INTO payment_alerts (alert_type, severity, title, description, metadata)
        VALUES (
            'high_churn_rate',
            'high',
            'High Churn Rate Detected',
            'Churn rate is ' || v_today_metrics.churn_rate || '% today, which is significantly higher than the 7-day average of ' || v_avg_churn_rate || '%',
            jsonb_build_object(
                'current_churn_rate', v_today_metrics.churn_rate,
                'average_churn_rate', v_avg_churn_rate,
                'date', CURRENT_DATE
            )
        );
    END IF;

    -- Check for revenue drop (more than 50% below average)
    IF v_today_metrics.total_revenue < (v_avg_revenue * 0.5) AND v_avg_revenue > 0 THEN
        INSERT INTO payment_alerts (alert_type, severity, title, description, metadata)
        VALUES (
            'revenue_drop',
            'high',
            'Revenue Drop Detected',
            'Revenue is $' || v_today_metrics.total_revenue || ' today, which is significantly lower than the 7-day average of $' || v_avg_revenue,
            jsonb_build_object(
                'current_revenue', v_today_metrics.total_revenue,
                'average_revenue', v_avg_revenue,
                'date', CURRENT_DATE
            )
        );
    END IF;

    -- Check for payment failure spike
    IF EXISTS (
        SELECT 1
        FROM payment_events
        WHERE DATE(created_at) = CURRENT_DATE
        AND event_type = 'payment_failed'
        GROUP BY DATE(created_at)
        HAVING COUNT(*) > (
            SELECT AVG(daily_failures)
            FROM (
                SELECT COUNT(*) as daily_failures
                FROM payment_events
                WHERE event_type = 'payment_failed'
                AND DATE(created_at) >= CURRENT_DATE - INTERVAL '7 days'
                AND DATE(created_at) < CURRENT_DATE
                GROUP BY DATE(created_at)
            ) daily_counts
        ) * 2
    ) THEN
        INSERT INTO payment_alerts (alert_type, severity, title, description, metadata)
        VALUES (
            'payment_failure_spike',
            'medium',
            'Payment Failure Spike Detected',
            'Payment failures today are significantly higher than the 7-day average',
            jsonb_build_object('date', CURRENT_DATE)
        );
    END IF;

END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON payment_events TO authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_metrics TO authenticated;
GRANT SELECT, INSERT, UPDATE ON payment_alerts TO authenticated;

-- Enable Row Level Security
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for payment events
CREATE POLICY "Users can view their organization's payment events" ON payment_events
    FOR SELECT USING (
        org_id IN (
            SELECT org_id FROM organization_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Service role can manage all payment events" ON payment_events
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for payment metrics
CREATE POLICY "Users can view payment metrics" ON payment_metrics
    FOR SELECT USING (true); -- Metrics are aggregated and not user-specific

CREATE POLICY "Service role can manage all payment metrics" ON payment_metrics
    FOR ALL USING (auth.role() = 'service_role');

-- Create RLS policies for payment alerts
CREATE POLICY "Users can view payment alerts" ON payment_alerts
    FOR SELECT USING (true); -- Alerts are system-wide

CREATE POLICY "Service role can manage all payment alerts" ON payment_alerts
    FOR ALL USING (auth.role() = 'service_role');

-- Create a view for payment analytics dashboard
CREATE OR REPLACE VIEW payment_analytics_dashboard AS
SELECT 
    pm.date,
    pm.total_revenue,
    pm.new_subscriptions,
    pm.cancelled_subscriptions,
    pm.active_subscriptions,
    pm.churn_rate,
    pm.mrr,
    pm.arr,
    pm.average_revenue_per_user,
    pm.conversion_rate,
    pm.plan_breakdown,
    -- Calculate growth metrics
    LAG(pm.total_revenue) OVER (ORDER BY pm.date) as prev_day_revenue,
    LAG(pm.mrr) OVER (ORDER BY pm.date) as prev_day_mrr,
    CASE 
        WHEN LAG(pm.total_revenue) OVER (ORDER BY pm.date) > 0 
        THEN ((pm.total_revenue - LAG(pm.total_revenue) OVER (ORDER BY pm.date)) / LAG(pm.total_revenue) OVER (ORDER BY pm.date)) * 100
        ELSE 0
    END as revenue_growth_percent,
    CASE 
        WHEN LAG(pm.mrr) OVER (ORDER BY pm.date) > 0 
        THEN ((pm.mrr - LAG(pm.mrr) OVER (ORDER BY pm.date)) / LAG(pm.mrr) OVER (ORDER BY pm.date)) * 100
        ELSE 0
    END as mrr_growth_percent
FROM payment_metrics pm
ORDER BY pm.date DESC;

-- Grant access to the dashboard view
GRANT SELECT ON payment_analytics_dashboard TO authenticated;

-- Create RLS policy for the dashboard view
CREATE POLICY "Users can view payment analytics dashboard" ON payment_analytics_dashboard
    FOR SELECT USING (true);

-- Insert sample data for testing (optional)
INSERT INTO payment_events (event_type, user_id, org_id, plan_id, amount, stripe_subscription_id)
VALUES 
    ('subscription_created', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'pro', 49.00, 'sub_sample_pro'),
    ('payment_succeeded', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00001', 'pro', 49.00, 'sub_sample_pro'),
    ('subscription_created', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'enterprise', 299.00, 'sub_sample_enterprise'),
    ('payment_succeeded', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', '00[PHONE_REDACTED]-0000-0[PHONE_REDACTED]00002', 'enterprise', 299.00, 'sub_sample_enterprise')
ON CONFLICT DO NOTHING;

-- Calculate metrics for the last few days
SELECT calculate_daily_payment_metrics(CURRENT_DATE - INTERVAL '1 day');
SELECT calculate_daily_payment_metrics(CURRENT_DATE);
