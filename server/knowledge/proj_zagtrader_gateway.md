# ZagTrader Gateway (synthesized from artifacts)
Source: /Users/yahya/Documents/ZagTrader-Gateway/ (postman_collection.json, endpoint_analysis.txt)

Synthesized from manifest, no README found.

ZagTrader-Gateway is the project folder where Yahya is normalizing ZagTrader's PHP backend API into clean RESTful endpoints. The folder contains:
- `zagtrader-gateway/` - the NestJS gateway implementation (per /Users/yahya/Documents/ZagTrader/README.md, this normalizes 77 backend PHP endpoints with kebab-case URLs, camelCase fields, proper HTTP methods, and Swagger auto-documentation).
- `postman_collection.json` - Postman collection for the upstream ZagTrader PHP API.
- `endpoint_analysis.txt` - per-endpoint analysis derived from the Postman collection (method, path, parameters, body mode, headers).

Sample endpoints documented in `endpoint_analysis.txt`:
- POST `/API/Backend/CreateUserAPI.php` (Create User) - takes apiKey, access_token, queue params; raw JSON body with `email_address`, `mobile_number`, `date_of_birth`, `full_name`, `investor_type`, `status`.
- GET `/API/Backend/UserBalancesPortfolioAPI3.php` (User Balances Portfolio) - takes `userId`.
- POST `/API/Backend/ChangeAccountStatus.php` (Change Account Status) - formdata body.
- POST `/API/Backend/CalculateCommission.php` (Calculate Commission) - formdata body.
- POST `/API/Backend/PlaceOrderAPI.php` (Place Order) - takes apiKey, access_token; raw JSON body with `apiOrderType`, `apiRegularTrading`, `apiPlacedFrom`, `apiSubUserId`, `apiCustodianId`, `apiUserId`, `apiTickerId`, `apiMarketValue`.

These artifacts are the raw input the gateway re-shapes into a cleaner REST API.
