#!/bin/bash

# LKHN Universal Wealth Firebase Deployment Script

# Color outputs
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print section header
section() {
  echo -e "\n${BLUE}==== $1 ====${NC}\n"
}

# Print success message
success() {
  echo -e "${GREEN}✓ $1${NC}"
}

# Print error message
error() {
  echo -e "${RED}✗ $1${NC}"
  exit 1
}

# Print warning message
warning() {
  echo -e "${YELLOW}! $1${NC}"
}

# Check if Firebase CLI is installed
section "Checking prerequisites"
if ! command -v firebase &> /dev/null; then
  error "Firebase CLI not found. Please install it with 'npm install -g firebase-tools'"
fi
success "Firebase CLI found"

# Check if user is logged in to Firebase
if ! firebase projects:list --json &> /dev/null; then
  warning "Not logged in to Firebase. Attempting to log in..."
  firebase login || error "Failed to log in to Firebase"
fi
success "Logged in to Firebase"

# Build the application
section "Building the application"
npm run build || error "Build failed"
success "Build completed"

# Set up Mailtrap configuration if not already set
section "Setting up Mailtrap configuration"
echo "Do you want to configure Mailtrap for email functionality? (y/n)"
read setupMailtrap

if [[ "$setupMailtrap" == "y" || "$setupMailtrap" == "Y" ]]; then
  echo "Enter Mailtrap host (default: sandbox.smtp.mailtrap.io):"
  read mailtrapHost
  mailtrapHost=${mailtrapHost:-sandbox.smtp.mailtrap.io}
  
  echo "Enter Mailtrap port (default: 587):"
  read mailtrapPort
  mailtrapPort=${mailtrapPort:-587}
  
  echo "Enter Mailtrap username:"
  read mailtrapUser
  
  echo "Enter Mailtrap password:"
  read -s mailtrapPass
  echo ""
  
  if [[ -z "$mailtrapUser" || -z "$mailtrapPass" ]]; then
    warning "Mailtrap username or password is empty. Skipping Mailtrap configuration."
  else
    echo "Setting up Mailtrap configuration..."
    firebase functions:config:set mailtrap.host="$mailtrapHost" || warning "Failed to set mailtrap.host"
    firebase functions:config:set mailtrap.port="$mailtrapPort" || warning "Failed to set mailtrap.port"
    firebase functions:config:set mailtrap.user="$mailtrapUser" || warning "Failed to set mailtrap.user"
    firebase functions:config:set mailtrap.pass="$mailtrapPass" || warning "Failed to set mailtrap.pass"
    success "Mailtrap configuration set"
  fi
else
  warning "Skipping Mailtrap configuration"
fi

# Deploy to Firebase
section "Deploying to Firebase"
echo "What would you like to deploy?"
echo "1. Everything (Hosting, Functions, Firestore, Storage)"
echo "2. Only Hosting"
echo "3. Only Functions"
echo "4. Only Firestore and Storage Rules"
read deployOption

case $deployOption in
  1)
    echo "Deploying everything..."
    firebase deploy || error "Deployment failed"
    ;;
  2)
    echo "Deploying only hosting..."
    firebase deploy --only hosting || error "Hosting deployment failed"
    ;;
  3)
    echo "Deploying only functions..."
    firebase deploy --only functions || error "Functions deployment failed"
    ;;
  4)
    echo "Deploying only Firestore and Storage rules..."
    firebase deploy --only firestore,storage || error "Rules deployment failed"
    ;;
  *)
    error "Invalid option"
    ;;
esac

# Get the deployed URL
section "Deployment successful"
HOSTING_URL=$(firebase hosting:channel:list --json | grep -o '"url": "[^"]*"' | head -1 | cut -d'"' -f4)

if [[ -n "$HOSTING_URL" ]]; then
  success "Your application is deployed at: $HOSTING_URL"
else
  success "Your application is deployed! Check the Firebase console for the URL."
fi

echo ""
success "Deployment completed successfully"