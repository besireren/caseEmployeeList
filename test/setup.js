import sinon from 'sinon';

// Mock browser APIs
globalThis.window = {
    location: {
        pathname: '/'
    },
    customElements: {
        define: () => {}
    },
    HTMLElement: class {},
    confirm: () => true,
    dispatchEvent: () => {},
    addEventListener: () => {},
    removeEventListener: () => {}
};

globalThis.document = {
    documentElement: {
        lang: 'en'
    },
    createElement: () => ({
        attachShadow: () => ({
            appendChild: () => {}
        }),
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => {}
    }),
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {}
};

// Mock CSS modules
globalThis.CSSStyleSheet = class {
    replaceSync() {}
};

// Mock lit-element features
globalThis.HTMLElement = class {};
globalThis.customElements = {
    define: () => {},
    get: () => {}
};

// Mock CSS
globalThis.CSS = {
    supports: () => false
};

// Mock Router
window.Router = {
    go: sinon.stub()
};

// Mock translations
window.translations = {
    en: {
        'form.submit.add': 'Add',
        'form.submit.update': 'Update',
        'form.submit.delete': 'Delete',
        'form.title.add': 'Add Employee',
        'form.title.edit': 'Edit Employee',
        'form.label.firstName': 'First Name',
        'form.label.lastName': 'Last Name',
        'form.label.dateOfEmployment': 'Date of Employment',
        'form.label.dateOfBirth': 'Date of Birth',
        'form.label.phone': 'Phone',
        'form.label.email': 'Email',
        'form.label.department': 'Department',
        'form.label.position': 'Position',
        'form.error.required': 'This field is required',
        'form.error.email': 'Invalid email format',
        'form.error.phone': 'Invalid phone format',
        'form.error.date': 'Invalid date format',
        delete: 'Delete',
        update: 'Update',
        add: 'Add',
        cancel: 'Cancel',
        confirm: 'Confirm',
        departments: {
            Tech: 'Tech',
            Analytics: 'Analytics',
            HR: 'HR',
            Sales: 'Sales'
        },
        positions: {
            Junior: 'Junior',
            Senior: 'Senior',
            Lead: 'Lead',
            Manager: 'Manager'
        }
    },
    tr: {
        'form.submit.add': 'Ekle',
        'form.submit.update': 'Güncelle',
        'form.submit.delete': 'Sil',
        'form.title.add': 'Çalışan Ekle',
        'form.title.edit': 'Çalışan Düzenle',
        'form.label.firstName': 'Ad',
        'form.label.lastName': 'Soyad',
        'form.label.dateOfEmployment': 'İşe Başlama Tarihi',
        'form.label.dateOfBirth': 'Doğum Tarihi',
        'form.label.phone': 'Telefon',
        'form.label.email': 'E-posta',
        'form.label.department': 'Departman',
        'form.label.position': 'Pozisyon',
        'form.error.required': 'Bu alan zorunludur',
        'form.error.email': 'Geçersiz e-posta formatı',
        'form.error.phone': 'Geçersiz telefon formatı',
        'form.error.date': 'Geçersiz tarih formatı',
        delete: 'Sil',
        update: 'Güncelle',
        add: 'Ekle',
        cancel: 'İptal',
        confirm: 'Onayla',
        departments: {
            Tech: 'Teknoloji',
            Analytics: 'Analitik',
            HR: 'İK',
            Sales: 'Satış'
        },
        positions: {
            Junior: 'Junior',
            Senior: 'Senior',
            Lead: 'Lider',
            Manager: 'Yönetici'
        }
    }
};

// Mock window.location
Object.defineProperty(window, 'location', {
    value: {
        pathname: '/',
        search: '',
        hash: '',
        host: 'localhost',
        protocol: 'http:',
        origin: 'http://localhost',
        hostname: 'localhost',
        port: '8080'
    },
    writable: true
}); 