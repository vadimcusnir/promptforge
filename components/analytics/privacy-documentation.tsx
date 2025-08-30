/**
 * Analytics Privacy Documentation Component
 * Displays what data is collected and how it's used
 */

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Eye, Database, Clock, Lock } from "lucide-react"
import { PRIVACY_ALIGNMENT, ANALYTICS_CONFIG } from "@/lib/analytics-events"

export function AnalyticsPrivacyDocumentation() {
  return (
    <div className="space-y-6">
      <Card className="bg-card border border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-accent">
            <Shield className="w-5 h-5" />
            Analytics & Telemetry - Privacy Alignment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Data Collection Overview */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Data We Collect
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-green-400">Essential Data</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {PRIVACY_ALIGNMENT.DATA_COLLECTED.ESSENTIAL.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-yellow-400">Optional Data</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {PRIVACY_ALIGNMENT.DATA_COLLECTED.OPTIONAL.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-red-400">Never Collected</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  {PRIVACY_ALIGNMENT.DATA_COLLECTED.NEVER.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-400 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Standard Events */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Standard Events Tracked</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-3">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                view_page
              </Badge>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                cta_click
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                pricing_select
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                start_trial
              </Badge>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                export
              </Badge>
            </div>
          </div>

          {/* Data Storage */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Storage & Retention
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Session Data</h4>
                <p className="text-sm text-gray-400">
                  Stored for {PRIVACY_ALIGNMENT.STORAGE.DURATION.SESSION_DATA}
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">User Data</h4>
                <p className="text-sm text-gray-400">
                  Stored for {PRIVACY_ALIGNMENT.STORAGE.DURATION.USER_DATA}
                </p>
              </div>
              <div className="bg-zinc-800/50 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Analytics Data</h4>
                <p className="text-sm text-gray-400">
                  Stored for {PRIVACY_ALIGNMENT.STORAGE.DURATION.ANALYTICS_DATA}
                </p>
              </div>
            </div>
          </div>

          {/* Purpose */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Purpose of Data Collection</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Primary Purpose</h4>
                  <p className="text-sm text-gray-400">{PRIVACY_ALIGNMENT.PURPOSE.PRIMARY}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Secondary Purpose</h4>
                  <p className="text-sm text-gray-400">{PRIVACY_ALIGNMENT.PURPOSE.SECONDARY}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-white">Never Used For</h4>
                  <p className="text-sm text-gray-400">{PRIVACY_ALIGNMENT.PURPOSE.NEVER}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Security & Access
            </h3>
            <div className="bg-zinc-800/50 p-4 rounded-lg">
              <p className="text-sm text-gray-400 mb-2">
                <strong>Storage:</strong> {PRIVACY_ALIGNMENT.STORAGE.LOCATION}
              </p>
              <p className="text-sm text-gray-400">
                <strong>Access:</strong> {PRIVACY_ALIGNMENT.STORAGE.ACCESS}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function AnalyticsEventDetails() {
  return (
    <Card className="bg-card border border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-accent">
          <Clock className="w-5 h-5" />
          Event Details & Fields
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-white mb-2">view_page Event</h4>
            <div className="bg-zinc-800/50 p-3 rounded text-sm font-mono text-gray-300">
              <div>page_path: string</div>
              <div>page_title: string</div>
              <div>page_category?: string</div>
              <div>session_id: string</div>
              <div>timestamp: number</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">cta_click Event</h4>
            <div className="bg-zinc-800/50 p-3 rounded text-sm font-mono text-gray-300">
              <div>cta_type: string</div>
              <div>cta_text: string</div>
              <div>cta_position: string</div>
              <div>target_url?: string</div>
              <div>session_id: string</div>
              <div>timestamp: number</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">pricing_select Event</h4>
            <div className="bg-zinc-800/50 p-3 rounded text-sm font-mono text-gray-300">
              <div>plan_id: string</div>
              <div>plan_type: 'free' | 'pro' | 'enterprise'</div>
              <div>billing_cycle: 'monthly' | 'annual'</div>
              <div>price: number</div>
              <div>currency: string</div>
              <div>session_id: string</div>
              <div>timestamp: number</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">start_trial Event</h4>
            <div className="bg-zinc-800/50 p-3 rounded text-sm font-mono text-gray-300">
              <div>plan_id: string</div>
              <div>trial_type: 'free' | 'pro_trial'</div>
              <div>user_id?: string</div>
              <div>email?: string</div>
              <div>session_id: string</div>
              <div>timestamp: number</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">export Event</h4>
            <div className="bg-zinc-800/50 p-3 rounded text-sm font-mono text-gray-300">
              <div>export_type: 'pdf' | 'json' | 'txt' | 'md' | 'zip'</div>
              <div>module_id?: string</div>
              <div>file_size?: number</div>
              <div>user_id?: string</div>
              <div>session_id: string</div>
              <div>timestamp: number</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
