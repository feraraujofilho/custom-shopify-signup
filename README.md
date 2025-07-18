# Custom Signup App for Shopify

A Shopify app that provides a customizable signup form with reseller tracking capabilities through URL parameters. This app enables merchants to track customer referrals and create custom signup experiences for their stores.

## 🚀 Features

- **Embeddable Signup Form**: Add a custom signup form to any page in your Shopify theme
- **Reseller Tracking**: Automatically capture and store reseller information from URL parameters
- **Structured Metafields**: Creates properly structured customer metafields for data consistency
- **App Proxy Integration**: Secure API communication through Shopify's app proxy
- **Automatic Redirects**: Seamlessly redirect customers to the login page after successful registration
- **Theme Integration**: Easy-to-configure theme extension with customizable settings

## 📋 Requirements

- Node.js 18.20 or higher
- Shopify CLI
- A Shopify Partner account
- A development store for testing

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/feraraujofilho/custom-signup-app.git
cd custom-signup-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Configure the App

Create a `.env` file based on `.env.example` (if available) or ensure your Shopify app credentials are set up through the Shopify CLI.

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm run dev
```

The Shopify CLI will guide you through:

- Connecting to your Partner account
- Creating or selecting an app
- Installing the app on your development store

## 📦 Project Structure

```
custom-signup-app/
├── app/                          # Remix app directory
│   ├── routes/                   # App routes
│   │   ├── api.signup.jsx       # API endpoint for customer creation
│   │   ├── app._index.jsx      # Main app dashboard
│   │   └── app.setup.jsx       # Metafield definition setup
│   └── shopify.server.js        # Shopify app configuration
├── extensions/                   # Shopify app extensions
│   └── signup-form/             # Theme extension
│       ├── assets/              # JavaScript and images
│       ├── blocks/              # Liquid blocks
│       └── locales/             # Translations
├── prisma/                      # Database schema
└── public/                      # Static assets
```

## 🔧 Configuration

### App Configuration

The app is configured through `shopify.app.toml`:

```toml
[access_scopes]
scopes = "read_customers,write_customers,write_products"

[app_proxy]
url = "https://your-app-url.com/api"
subpath = "custom-signup"
prefix = "apps"
```

### Metafield Configuration

The app automatically creates a customer metafield definition with:

- **Namespace**: `custom`
- **Key**: `reseller`
- **Type**: `single_line_text_field`
- **Visibility**: Pinned (visible in Shopify admin)

## 💻 Usage

### 1. Install the App

Install the app on your Shopify store through the Partner Dashboard or using the Shopify CLI.

### 2. Add the Signup Form to Your Theme

1. Go to your theme editor in the Shopify admin
2. Navigate to the page where you want to add the signup form
3. Add the "Custom Signup Form" section/block
4. Configure the form settings (title, button text, etc.)

### 3. Share Referral Links

Create referral links by adding the `reseller` parameter to your signup page URL:

```
https://yourstore.com/pages/signup?reseller=PARTNER_NAME
```

When customers sign up through this link, "PARTNER_NAME" will be stored in their customer metafield.

### 4. View Customer Data

Customer reseller information can be viewed in:

- Shopify Admin > Customers > [Customer Name] > Metafields
- Via the Admin API for programmatic access

## 🔍 API Endpoints

### POST `/api/custom-signup/signup`

Creates a new customer with optional reseller metafield.

**Request Body:**

```json
{
  "email": "customer@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "reseller": "PARTNER_NAME"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Customer created successfully"
}
```

## 🧪 Testing

### Local Development

1. Use the Shopify CLI to create a development tunnel
2. Install the app on your development store
3. Test the signup form with various reseller parameters

### Test Cases

- ✅ Customer creation without reseller parameter
- ✅ Customer creation with reseller parameter
- ✅ Duplicate email handling
- ✅ Form validation
- ✅ Redirect functionality

## 🚀 Deployment

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Deploy to Shopify

```bash
npm run deploy
# or
yarn deploy
# or
pnpm deploy
```

### Environment Variables

Ensure these environment variables are set in your production environment:

- `SHOPIFY_API_KEY`
- `SHOPIFY_API_SECRET`
- `SCOPES`
- `SHOPIFY_APP_URL`

## 🐛 Troubleshooting

### Common Issues

**1. GraphQL Client: Unauthorized (401) Error**

- Ensure the app has the correct access scopes
- Check that the session is valid
- Verify the app proxy configuration

**2. Metafield Not Showing in Admin**

- Run the setup route to create the metafield definition
- Ensure the metafield is set as "pinned"
- Check that the namespace and key match exactly

**3. Form Not Appearing in Theme**

- Verify the theme extension is properly installed
- Check browser console for JavaScript errors
- Ensure the app proxy URL is correctly configured

### Debug Mode

Enable debug logging by setting:

```javascript
console.log("Metafield definition setup:", setupFetcher.data);
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Resources

- [Shopify App Development](https://shopify.dev/docs/apps)
- [Remix Documentation](https://remix.run/docs)
- [Shopify Polaris](https://polaris.shopify.com/)
- [Metafields Documentation](https://shopify.dev/docs/apps/build/custom-data/metafields)
- [Theme Extensions](https://shopify.dev/docs/apps/online-store/theme-app-extensions)

## 📞 Support

For issues, questions, or contributions, please:

1. Check the [Issues](https://github.com/yourusername/custom-signup-app/issues) page
2. Review the troubleshooting guide above
3. Create a new issue with detailed information

---

Made with ❤️ for Shopify merchants

# custom-shopify-signup
