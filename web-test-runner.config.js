import { playwrightLauncher } from '@web/test-runner-playwright';

export default {
    files: 'test/**/*.test.js',
    nodeResolve: true,
    coverage: true,
    coverageConfig: {
        reportDir: 'coverage',
        threshold: {
            statements: 85,
            branches: 85,
            functions: 85,
            lines: 85
        }
    },
    browsers: [
        playwrightLauncher({
            product: 'chromium',
            launchOptions: {
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            }
        }),
    ],
    testFramework: {
        config: {
            ui: 'bdd',
            timeout: '30000'
        }
    },
    testsStartTimeout: 60000,
    testRunnerHtml: testFramework => `
        <html>
            <body>
                <script type="module" src="${testFramework}"></script>
            </body>
        </html>
    `
}; 