# Employee Management System

<div align="center">
  <h3>Modern Employee Management Application</h3>
  <p>A responsive web application for managing employee data with multi-language support</p>
</div>

## ✨ Features

- **Employee Management**
  - View all employees in table or grid layout
  - Add, edit, and delete employee records
  - Search employees by name, department, position, or other fields
  - Pagination for large datasets
  
- **Modern UI**
  - Responsive design works on desktop and mobile devices
  - Interactive components with smooth transitions
  - Two view modes (table and grid) for different display preferences
  
- **Advanced Features**
  - Multi-language support (English/Turkish)
  - Client-side form validation
  - State management with Redux
  - Data persistence
  
## 🚀 Tech Stack

- **Frontend Framework**: LitElement for lightweight, reactive web components
- **Routing**: Vaadin Router for client-side navigation
- **State Management**: Redux for predictable state container
- **Internationalization**: Lit Localize for multi-language support
- **Build Tools**: Webpack for bundling and optimization
- **Testing**: Web Test Runner with Mocha/Chai for testing

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher) or yarn

## 💻 Installation

### Clone the repository

```bash
git clone https://github.com/besireren/caseEmployeeList.git
cd caseEmployeeList
```

### Install dependencies

```bash
npm install
# or
yarn install
```

### Start development server

```bash
npm start
# or
yarn start
```

Visit `http://localhost:8080` in your browser to see the application.

## 🏗️ Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be available in the `dist` directory.

## 🧪 Testing

Run tests with coverage:

```bash
npm test
# or
yarn test
```

Run tests in watch mode:

```bash
npm run test:watch
# or
yarn test:watch
```

## 📁 Project Structure

```
employee-management/
├── public/                # Public static assets
├── src/                   # Source files
│   ├── components/        # Web components
│   │   ├── app-root.js            # Main application component
│   │   ├── employee-list.js       # Employee listing component
│   │   ├── employee-form.js       # Employee form component
│   │   └── confirmation-dialog.js # Confirmation dialog component
│   ├── locales/           # Localization files
│   │   ├── en.js          # English translations
│   │   └── tr.js          # Turkish translations
│   ├── store.js           # Redux store configuration
│   └── index.js           # Application entry point
├── test/                  # Test files
├── webpack.config.js      # Webpack configuration
└── package.json           # Project metadata and dependencies
```

## 🌐 Localization

The application supports English and Turkish languages. Language selection is available in the UI via the language dropdown in the top-right corner with text-based indicators (EN/TR).

Default language is determined by the `lang` attribute in HTML:

```html
<html lang="en"> <!-- English -->
<html lang="tr"> <!-- Turkish -->
```

## ✅ Validation Rules

The application enforces the following validation rules for employee data:

| Field             | Validation Rules                                           |
|-------------------|-----------------------------------------------------------|
| First Name        | Required, max 50 characters                               |
| Last Name         | Required, max 50 characters                               |
| Email             | Required, valid email format, must be unique               |
| Phone             | Required, format: +(90) 532 123 45 67                     |
| Date of Birth     | Required, valid date                                      |
| Date of Employment| Required, valid date                                      |
| Department        | Required, must be one of: Analytics, Tech                  |
| Position          | Required, must be one of: Junior, Medior, Senior           |

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

---

Developed with ❤️ by ING
