#!/bin/bash

# Script to delete unused empty files

echo "Starting cleanup of unused empty files..."

# Files to delete (unused empty files)
files_to_delete=(
  # Unused components
  "./src/components/agent/ActionApproval.tsx"
  "./src/components/agent/AgentChat.tsx"
  "./src/components/agent/TaskList.tsx"
  "./src/components/hub/BookingCalendar.tsx"
  "./src/components/hub/EventCard.tsx"
  "./src/components/hub/LocationMap.tsx"
  "./src/components/trendcrypto/AIInsight.tsx"
  "./src/components/trendcrypto/CryptoCard.tsx"
  "./src/components/trendcrypto/TrendingCoins.tsx"
  
  # Unused contexts
  "./src/contexts/AgentContext.tsx"
  "./src/contexts/HubContext.tsx"
  "./src/contexts/TrendCryptoContext.tsx"
  
  # Unused hooks
  "./src/hooks/useAgentTasks.ts"
  "./src/hooks/useCryptoData.ts"
  "./src/hooks/useHubBookings.ts"
  
  # Unused services
  "./src/services/agent/schedule.ts"
  "./src/services/agent/tasks.ts"
  "./src/services/agent/trades.ts"
  "./src/services/hub/bookings.ts"
  "./src/services/hub/events.ts"
  "./src/services/hub/locations.ts"
  "./src/services/trendcrypto/aiPredictions.ts"
  "./src/services/trendcrypto/marketData.ts"
  "./src/services/trendcrypto/portfolioAnalysis.ts"
  
  # Unused pages
  "./src/pages/AgentPage.tsx"
  
  # Unused types
  "./src/types/agent.ts"
  "./src/types/hub.ts"
  "./src/types/trendcrypto.ts"
)

# Delete each file if it exists and is empty
for file in "${files_to_delete[@]}"; do
  if [ -f "$file" ] && [ ! -s "$file" ]; then
    rm "$file"
    echo "Deleted: $file"
  else
    echo "Skipped: $file (not found or not empty)"
  fi
done

echo "Cleanup completed."
