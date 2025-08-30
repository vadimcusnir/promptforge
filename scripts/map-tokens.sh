#!/bin/bash

# Token mapping script for PromptForge v3
# Maps old tokens to canonical tokens in live code only

echo "🔄 Mapping tokens in live code..."

# Function to replace tokens in files
map_tokens() {
    local file="$1"
    local temp_file=$(mktemp)
    
    # Apply token mappings
    sed -E '
        s/bg-bg\b/bg-bg-primary/g
        s/bg-bg-secondary\b/bg-surface/g
        s/text-text\b/text-fg-primary/g
        s/text-muted\b/text-fg-muted/g
        s/brand\b/accent/g
        s/brand-contrast\b/accent-contrast/g
        s/bg-hover\b/bg-bg-hover/g
        s/text-link\b/text-accent/g
    ' "$file" > "$temp_file"
    
    # Check if file changed
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        echo "✅ Updated: $file"
        return 0
    else
        rm "$temp_file"
        return 1
    fi
}

# Counters
updated_files=0
total_files=0

# Process app directory
echo "📁 Processing app/ directory..."
for file in $(find app -name "*.tsx" -o -name "*.ts" | grep -v node_modules); do
    total_files=$((total_files + 1))
    if map_tokens "$file"; then
        updated_files=$((updated_files + 1))
    fi
done

# Process components directory
echo "📁 Processing components/ directory..."
for file in $(find components -name "*.tsx" -o -name "*.ts" | grep -v node_modules); do
    total_files=$((total_files + 1))
    if map_tokens "$file"; then
        updated_files=$((updated_files + 1))
    fi
done

# Process lib directory
echo "📁 Processing lib/ directory..."
for file in $(find lib -name "*.tsx" -o -name "*.ts" | grep -v node_modules); do
    total_files=$((total_files + 1))
    if map_tokens "$file"; then
        updated_files=$((updated_files + 1))
    fi
done

echo ""
echo "📊 Token mapping complete!"
echo "   Files processed: $total_files"
echo "   Files updated: $updated_files"

# Verify no old tokens remain
echo ""
echo "🔍 Verifying no old tokens remain..."
old_tokens=$(grep -rn "bg-bg \|text-text\| brand(?!-)" app components lib 2>/dev/null | wc -l)
if [ "$old_tokens" -eq 0 ]; then
    echo "✅ No old tokens found - mapping successful!"
else
    echo "⚠️  Found $old_tokens instances of old tokens"
    grep -rn "bg-bg \|text-text\| brand(?!-)" app components lib 2>/dev/null
fi
