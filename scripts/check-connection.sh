#!/usr/bin/env bash
# Quick check: can your phone reach the Rails API?

set -euo pipefail

IP=$(hostname -I | awk '{print $1}')
API="http://${IP}:3000"

echo ""
echo "=== Wedding API Connection Check ==="
echo ""
echo "Your PC IP:     $IP"
echo "API URL:        ${API}/api/v1"
echo ""

echo -n "1. Backend running? "
if curl -sf "${API}/up" > /dev/null 2>&1; then
  echo "YES"
else
  echo "NO — start backend first:"
  echo "   cd wedding-api && rails server"
  exit 1
fi

echo -n "2. Login API works? "
HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${API}/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@wedding.com","password":"password123"}')
if [ "$HTTP" = "200" ]; then
  echo "YES"
else
  echo "NO (HTTP $HTTP)"
  exit 1
fi

echo ""
echo "=== Mobile app setup ==="
echo ""
echo "Terminal 1 (keep running):"
echo "  cd wedding-api && rails server"
echo ""
echo "Terminal 2:"
echo "  cd wedding-mobile && npm start"
echo ""
echo "On phone:"
echo "  • Same Wi-Fi as this PC"
echo "  • Expo Go → scan QR code"
echo "  • Login: admin@wedding.com / password123"
echo ""
echo "App will connect to: ${API}/api/v1"
echo ""
