## 10. Security â€” Bulletproof Architecture (Framework Agnostic)

> This section applies to **any backend** (Laravel, Node.js/Express, ASP.NET, Nuxt/Nitro, Python/Django, Go, Rust)  
> and **any deployment** (VPS, shared hosting, Vercel, Netlify, AWS, Azure, DigitalOcean, on-premise).  
> Principles are universal â€” implementation details shown in multiple languages.

---

### 10.1 OWASP Top 10 Threat Coverage

| # | OWASP Threat | How We Defend | Priority |
|---|-------------|---------------|----------|
| 1 | **Broken Access Control** | RLS / middleware / role-based guards every route | ðŸ”´ Critical |
| 2 | **Cryptographic Failures** | TLS 1.3, AES-256 at rest, bcrypt passwords | ðŸ”´ Critical |
| 3 | **Injection** (SQL, NoSQL, OS, LDAP) | Parameterized queries, ORM, input validation | ðŸ”´ Critical |
| 4 | **Insecure Design** | Rate limiting, audit trails, secure defaults | ðŸ”´ Critical |
| 5 | **Security Misconfiguration** | Hardened headers, CSP, minimal attack surface | ðŸŸ¡ High |
| 6 | **Vulnerable Components** | Automated dependency scanning, Snyk/Dependabot | ðŸŸ¡ High |
| 7 | **Auth Failures** | MFA, password policy, session rotation, lockout | ðŸ”´ Critical |
| 8 | **Data Integrity Failures** | Stripe webhook signatures, idempotency, CSRF tokens | ðŸŸ¡ High |
| 9 | **Logging & Monitoring** | Immutable audit trail, real-time alerting | ðŸŸ¡ High |
| 10 | **SSRF** | Outbound network allowlist, URL validation | ðŸŸ¡ High |

---

### 10.2 Authentication & Identity Security

#### Password Policy (Any Backend)

```
â”Œâ”€ Admin Account â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ Min length:      12 characters                           â”‚
â”‚ Complexity:      Upper + Lower + Number + Special         â”‚
â”‚ Max attempts:    5 before 15-min lockout                 â”‚
â”‚ MFA:             REQUIRED (TOTP / WebAuthn)              â”‚
â”‚ Session expiry:  24 hours (admin), 7 days (clients)      â”‚
â”‚ Refresh tokens:  Rotate every request                    â”‚
â”‚ Rate limit:      5 req/min per IP on /login              â”‚
â”‚ Pass history:    Cannot reuse last 10 passwords          â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

##### Laravel Implementation

```php
// config/auth.php
'password_timeout' => 3600, // Re-prompt password for sensitive actions

// Via Fortify / Jetstream
// Add custom rate limiter in App\Http\Controllers\Auth\LoginController
protected function limiter() {
    return RateLimiter::for('login', function (Request $request) {
        $key = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());
        return Limit::perMinute(5)->by($key);
    });
}
```

##### Node.js / Express Implementation

```js
// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: 'Too many login attempts. Try again in 1 minute.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip + ':' + req.body.email,
});
app.use('/api/auth/login', loginLimiter);
```

##### ASP.NET Implementation

```csharp
// Program.cs
builder.Services.AddRateLimiter(options => {
    options.AddPolicy("LoginPolicy", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1)
            }));
});

// Login endpoint
[EnableRateLimiting("LoginPolicy")]
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request) { ... }
```

#### Multi-Factor Authentication (MFA)

```
Flow:
  Login â†’ password correct? â†’ prompt for TOTP code â†’ verify â†’ session issued

Implementation options per backend:
  Laravel:     Laravel Fortify + Laravel Jetstream (built-in 2FA)
  Node.js:     speakeasy (TOTP) + qrcode (for setup) OR Authy API
  ASP.NET:     ASP.NET Core Identity (built-in 2FA)
  Nuxt:        supabase.auth.mfa (built-in)

Backup codes:  Generate 8 single-use codes on MFA enrollment
  Recovery:    One backup code + email verification to reset MFA
```

#### Session Security (Universal)

```
RULES:
  â”€ Session tokens stored in httpOnly, Secure, SameSite=Strict cookies
  â”€ Session ID regenerated on login and privilege escalation
  â”€ Session timeout enforced server-side (not just client)
  â”€ Concurrent session limit: max 3 active sessions per user
  â”€ Sessions invalidated on password change
  â”€ Idle timeout: 15 minutes (dashboard), 7 days (client portal with remember-me)
  â”€ Refresh token rotation: old refresh token becomes invalid on use

CLIENT-SIDE STORAGE PROHIBITED:
  âŒ Never store in localStorage or sessionStorage
  âŒ Never store in URL params
  âŒ Never store in JavaScript variables (XSS vulnerable)
  âœ… httpOnly cookies (recommended)
  âœ… SameSite=Strict (CSRF protection)
  âœ… Secure flag (HTTPS only)
```

##### Laravel Sanctum / Session

```php
// config/session.php
'secure' => env('APP_ENV') === 'production', // HTTPS only
'http_only' => true,
'same_site' => 'strict',
'lifetime' => 1440, // 24 hours in minutes

// config/cors.php (SPA cookie auth)
'supports_credentials' => true,
```

##### Express Session

```js
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: '__Host-sid', // __Host- prefix ensures Secure + Path=/
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  resave: false,
  saveUninitialized: false,
}));
```

##### ASP.NET Cookie

```csharp
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options => {
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.ExpireTimeSpan = TimeSpan.FromHours(24);
        options.SlidingExpiration = true;
    });
```

#### Account Lockout & Brute Force Protection

```
TRIPLE BARRIER:
  1. Rate limiting at application level (5 req/min)
  2. Rate limiting at infrastructure level (WAF / Nginx / Cloudflare)
  3. Account lockout after 5 failed attempts (15 min)

MONITORING:
  â”€ Failed login attempts logged with IP + user agent + timestamp
  â”€ Alert sent if > 20 failed attempts globally in 5 minutes
  â”€ IP blocked for 1 hour if > 50 failed attempts from same IP
  â”€ Implements exponential backoff: 1min â†’ 5min â†’ 15min â†’ 1hr

Common password list check:
  â”€ Reject passwords found in HaveIBeenPwned (API v3: https://api.pwnedpasswords.com/range/{hashPrefix})
  â”€ Block common patterns: "admin123", "password", "companyname2024"
```

##### Laravel (built-in)

```php
// Laravel handles lockout via ThrottleLogins trait in LoginController
// Customize in App\Http\Controllers\Auth\LoginController
protected function hasTooManyLoginAttempts(Request $request) {
    return RateLimiter::tooManyAttempts($this->throttleKey($request), 5);
}
protected function incrementLoginAttempts(Request $request) {
    RateLimiter::hit($this->throttleKey($request), 900); // 15 min decay
}
```

---

### 10.3 Input Validation & Injection Prevention

#### Universal Validation Rules

```
Every user-supplied input MUST be validated at these layers:

  Layer 1: Client-side (UX convenience only â€” never trust)
  Layer 2: Server-side input validation (ALL endpoints)
  Layer 3: Database parameterization (no raw concatenation)
  Layer 4: Output encoding (context-aware escaping)

PRINCIPLE: Never trust anything. Validate, sanitize, parameterize.
```

##### Laravel Request Validation

```php
// App\Http\Requests\StoreClientRequest.php
public function rules() {
    return [
        'name' => 'required|string|min:2|max:100',
        'email' => 'required|email:rfc,dns|max:255|unique:clients,email',
        'phone' => 'nullable|regex:/^\+?[\d\s\-()]{7,20}$/',
        'company' => 'nullable|string|max:200',
        'notes' => 'nullable|string|max:5000',
    ];
}

public function messages() {
    return [
        'email.unique' => 'A client with this email already exists.',
    ];
}
```

##### Node.js + Zod OR Joi

```js
const { z } = require('zod');
const createClientSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  email: z.string().email().max(255).toLowerCase().trim(),
  phone: z.string().regex(/^\+?[\d\s\-()]{7,20}$/).optional(),
  company: z.string().max(200).trim().optional(),
  notes: z.string().max(5000).trim().optional(),
});

// Middleware
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.issues.map(i => ({ field: i.path.join('.'), message: i.message })),
    });
  }
  req.validatedBody = result.data;
  next();
};

router.post('/api/clients', validate(createClientSchema), async (req, res) => { ... });
```

##### ASP.NET Data Annotations

```csharp
public class CreateClientRequest
{
    [Required, StringLength(100, MinimumLength = 2)]
    public string Name { get; set; }

    [Required, EmailAddress, StringLength(255)]
    public string Email { get; set; }

    [Phone, StringLength(20)]
    public string? Phone { get; set; }

    [StringLength(200)]
    public string? Company { get; set; }

    [StringLength(5000)]
    public string? Notes { get; set; }
}

[HttpPost]
public async Task<IActionResult> CreateClient([FromBody, Required] CreateClientRequest request)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    // ...
}
```

#### SQL Injection Prevention (All Backends)

```
GOLDEN RULE: NEVER concatenate user input into SQL strings.

  âœ… Parameterized queries / prepared statements
  âœ… ORM query builders (Eloquent, Prisma, Entity Framework, Sequelize)
  âœ… Stored procedures with typed parameters
  âŒ Raw string interpolation: "WHERE id = '$input'"  â† HACKED
  âŒ dynamic WHERE clauses from query strings
  âŒ eval() or exec() with user data

Even "safe" ORM methods can be dangerous:
  Laravel:  `User::whereRaw("name = '$input'")` â† SQL injection
  Node:     `prisma.$queryRawUnsafe("SELECT * FROM users WHERE id = $1", input)` â† OK if $1 is parameterized
  Node:     `sequelize.query(\`SELECT * FROM users WHERE id = '${input}'\`)` â† HACKED
  .NET:     `context.Database.SqlQueryRaw("SELECT * FROM Users WHERE Name = @name", new SqlParameter("@name", input))` â† OK
```

#### NoSQL Injection (if using MongoDB)

```js
// BAD â€” vulnerable to $gt, $ne injection:
db.users.find({ email: req.body.email, password: req.body.password });

// GOOD â€” use allowlist of operators:
const sanitizeQuery = (input) => {
  if (typeof input !== 'string') return null;
  return { $eq: input }; // Only allow exact match
};
db.users.find({ email: sanitizeQuery(req.body.email) });
```

#### OS Command Injection

```
NEVER pass user input to shell commands.

  Laravel:  âŒ `shell_exec("convert $input image.png")`
            âœ… `Process::run(['convert', $escapedInput, 'image.png'])`  // escapes args

  Node:     âŒ `exec(`convert ${input} image.png`)`
            âœ… `execFile('convert', [input, 'image.png'])`  // no shell

  .NET:     âŒ `Process.Start("cmd.exe", $"/c convert {input} image.png")`
            âœ… `Process.Start("convert", [$input, "image.png"])`

  Python:   âŒ `os.system(f"convert {input} image.png")`
            âœ… `subprocess.run(["convert", input, "image.png"])`
```

---

### 10.4 Cross-Site Scripting (XSS) Prevention

#### Universal Output Encoding Strategy

```
CONTEXT                  ESCAPE METHOD            EXAMPLE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
HTML body content        HTML entity escape       &lt;script&gt; â†’ &lt;script&gt;
HTML attributes          Attribute escape         " onload="alert(1) â†’ &quot;
JavaScript strings       JS string escape         \x27 + alert(1) â†’
URL parameters           URL encoding             <script> â†’ %3Cscript%3E
CSS values               CSS escape               background:url(javascript:...)

Vue/React/Svelte         Framework auto-escapes   {{ userInput }} â†’ safe (unless v-html / dangerouslySetInnerHTML)
```

#### Rich Text Handling (Messages, Invoices, Proposals)

```
NEVER render user-submitted HTML without sanitization.

  âœ… DOMPurify (browser-side, works with all frameworks)
  âœ… Bleach (Python)
  âœ… HTML Purifier (PHP)
  âœ… HtmlSanitizer (.NET)

Config (all libraries):
  â”€ Strip all <script>, <iframe>, <object>, <embed>, <style>
  â”€ Strip all on* attributes (onclick, onload, onerror, onmouseover...)
  â”€ Strip javascript:, data:, vbscript: from href/src
  â”€ Allow only: p, br, strong, em, a, ul, ol, li, h1-h6, blockquote, pre, code, img
  â”€ Allow only href, target=_blank, src, alt attributes
```

##### PHP / Laravel

```php
use HTMLPurifier;

$purifier = new HTMLPurifier($config);
$safeHtml = $purifier->purify($request->message_body);

// Blade: {{ $safeHtml }} â† auto-escaped
// {!! $safeHtml !!} â† raw output (only after purification)
```

##### Node.js

```js
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitized = DOMPurify.sanitize(req.body.message, {
  ALLOWED_TAGS: ['p','br','strong','em','a','ul','ol','li','h1','h2','h3','h4','h5','h6','blockquote','pre','code','img'],
  ALLOWED_ATTR: ['href', 'target', 'src', 'alt'],
  ALLOW_DATA_ATTR: false,
});
```

##### .NET

```csharp
using HtmlSanitizer;

var sanitizer = new HtmlSanitizer();
sanitizer.AllowedTags.Add("p");
sanitizer.AllowedTags.Add("strong");
// ... configure

string clean = sanitizer.Sanitize(input);
```

#### Content Security Policy (CSP) â€” Any Server

```
CSP prevents XSS even if an injection slips through by restricting what resources can load.

Laravel (Middleware):                         Node (Helmet):
  Response header set via middleware           app.use(helmet.contentSecurityPolicy({
  or in nginx/apache config                     directives: { defaultSrc: ["'self'"], ... }
                                              }))

ASP.NET (Middleware):                         Nginx:
  app.UseCsp();                               add_header Content-Security-Policy "...";

POLICY (universal):
  default-src 'self'
  script-src 'self' https://js.stripe.com
  style-src 'self' 'unsafe-inline'            â† needed for Tailwind/nuxt-ui
  img-src 'self' data: https://*.supabase.co https://yt3.ggpht.com
  frame-src 'self' https://www.youtube.com https://js.stripe.com https://hooks.stripe.com
  connect-src 'self' https://*.supabase.co https://api.stripe.com https://api.resend.com
  font-src 'self'
  object-src 'none'
  base-uri 'self'
  form-action 'self'
  frame-ancestors 'none'
```

---

### 10.5 Cross-Site Request Forgery (CSRF) â€” Comprehensive

##### What CSRF is

```
CSRF forces an authenticated user to perform unintended actions on a web app
in which they're currently logged in.

CLASSIC ATTACK:
  1. Admin is logged into https://dashboard.amin670bd.com (session cookie active)
  2. Admin visits https://evil.com (separate browser tab)
  3. evil.com loads: <img src="https://dashboard.amin670bd.com/api/clients/5/delete">
  4. Browser auto-sends the session cookie â†’ client deleted without admin knowing

CSRF WORKS BECAUSE:
  â”€ Cookies are automatically sent with cross-origin requests (without SameSite)
  â”€ The server can't distinguish between a real user action and a forged one
  â”€ GET requests that mutate state are especially vulnerable
```

##### CSRF defense layers (all required)

```
LAYER 1: Anti-CSRF tokens
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Every state-changing form/request includes a unique, unpredictable token.
  Server validates the token before processing the request.

LAYER 2: SameSite cookies
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Set SameSite=Strict or SameSite=Lax on session cookies.
  Strict:  Cookie never sent on cross-site requests (most secure)
  Lax:     Cookie sent for top-level GET navigations (form POSTs blocked)
  None:    Cookie sent everywhere â€” UNSAFE, requires Secure flag + CSRF token

LAYER 3: Custom request headers
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Require a custom header (X-Requested-By, X-CSRF-TOKEN) for API calls.
  Browsers enforce CORS: custom headers trigger preflight â†’ CORS blocks evil origins.

LAYER 4: Double-submit cookies
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Send CSRF token in both a cookie and a request header.
  Server checks they match. Evil site can't read the cookie to set the header.

LAYER 5: Origin / Referer header validation
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Server checks the Origin or Referer header matches your domain.
  Simple, effective for API-only apps â€” but Referer can be missing.
```

##### Implementation by backend

###### Laravel

```php
// Laravel handles CSRF automatically for web routes via VerifyCsrfToken middleware.
// For SPA APIs, use Sanctum's CSRF protection:

// 1. Fetch CSRF cookie
// GET /sanctum/csrf-cookie â†’ sets XSRF-TOKEN cookie

// 2. Send token in header
// axios.defaults.headers.common['X-XSRF-TOKEN'] =
//   Cookies.get('XSRF-TOKEN');

// Exclude webhook routes from CSRF (Stripe needs raw body)
// App\Http\Middleware\VerifyCsrfToken.php
protected $except = [
    'stripe/*',
    'webhook/*',
];
```

###### Node.js / Express

```js
// Using csurf (legacy) or csrf-csrf (modern)
const { doubleCsrf } = require('csrf-csrf');

const { generateToken, validateRequest } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET,
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // Only protect state-changing methods
});

// Generate token â†’ include in responses for forms/SPA
app.get('/api/csrf-token', (req, res) => {
  res.json({ token: generateToken(req, res) });
});

// Protect API routes
app.post('/api/clients', validateRequest, async (req, res) => { ... });
app.use('/api', (err, req, res, next) => {
  if (err.code === 'EBADCSRFTOKEN') {
    // Log CSRF attempt
    logger.warn('CSRF attack detected', { ip: req.ip, path: req.path });
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  next(err);
});

// BONUS: Require custom header as secondary check
const requireCustomHeader = (req, res, next) => {
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Missing required header' });
  }
  next();
};
app.post('/api/clients', requireCustomHeader, validateRequest, handler);
```

###### ASP.NET Core

```csharp
// Program.cs â€” CSRF via Antiforgery

// 1. Register
builder.Services.AddAntiforgery(options => {
    options.HeaderName = "X-CSRF-TOKEN";
    options.Cookie.Name = "__Host-X-CSRF-TOKEN";
    options.Cookie.HttpOnly = true;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});

// 2. Generate token endpoint
app.MapGet("/api/csrf-token", (IAntiforgery af, HttpContext ctx) => {
    var tokens = af.GetAndStoreTokens(ctx);
    return Results.Ok(new { token = tokens.RequestToken });
});

// 3. Protect controllers
[AutoValidateAntiforgeryToken]
public class ClientsController : Controller {
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([FromBody] CreateClientRequest request) {
        // ...
    }
}

// 4. SPA integration (Angular/Vue)
// Angular has built-in CSRF handling for XSRF-TOKEN cookie
```

###### Nuxt / Nitro

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    experimental: {
      csrProtection: true, // Enables CSRF for Nitro routes
    },
  },
});

// Or custom middleware:
export default defineEventHandler(async (event) => {
  // Skip for GET/HEAD/OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return;

  const token = getHeader(event, 'x-csrf-token');
  const cookie = getCookie(event, 'csrf-token');

  if (!token || !cookie || token !== cookie) {
    await logSecurityEvent(event, 'csrf_attack');
    throw createError({ statusCode: 403, statusMessage: 'CSRF validation failed' });
  }
});
```

##### SameSite cookie deep dive

```
SameSite=Strict    â†’ Cookie NEVER sent for cross-site requests
                     Best protection, but breaks some legitimate flows
                     (e.g., clicking a link from email to dashboard)

SameSite=Lax       â†’ Cookie sent for top-level GET navigations
                     BALANCE: protects POST/PUT/DELETE, allows links from email
                     RECOMMENDED default for most apps

SameSite=None      â†’ Cookie sent for ALL cross-site requests
                     REQUIRES Secure flag (HTTPS only)
                     Use ONLY if you have a specific cross-origin need
                     MUST be combined with CSRF tokens

BROWSER SUPPORT:
  â”€ Chrome:   SameSite=Lax is DEFAULT since 2020
  â”€ Firefox:  SameSite=Lax default since 2021
  â”€ Safari:   SameSite=Lax default since 2021
  â”€ Edge:     SameSite=Lax default

IF YOU DON'T SET IT: modern browsers default to Lax (good for security)
IF YOU SET None WITHOUT Secure: browser rejects the cookie
```

##### CSRF vs CORS â€” what each protects

```
CSRF: "Is this action intentionally performed by the user?"
       Token validation â†’ prevents forged requests

CORS:  "Can this external site READ the response?"
       Origin validation â†’ prevents data theft

THEY ARE COMPLEMENTARY:
  â”€ CSRF without CORS: evil.com can POST (state change) but can't READ response
    â†’ damage limited but still possible (delete action needs no response)
  â”€ CORS without CSRF: evil.com can't read, but can write
    â†’ combined with SameSite=Lax blocks most write attacks
  â”€ BOTH REQUIRED for cookie-based auth
  â”€ JWT in header (not cookie): CSRF not needed (browser doesn't auto-send)
    But CORS still required
```

##### CSRF attack scenarios & defenses

```
SCENARIO                    VULNERABLE                       DEFENDED
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
1. img tag delete           GET /api/client/5/delete         Only POST/DELETE for mutations
2. auto-submit form         <form action="/api/transfer">    CSRF token + SameSite
3. XSS + CSRF combo         XSS steals CSRF token            httpOnly cookie, separate endpoint
4. CSRF on file upload      POST /api/upload no token        Token required, CORS check
5. Login CSRF               POST /api/login no token         Token + Referer check
6. OAuth CSRF               state param predictable          crypto.randomUUID() for state
7. JSON content-type bypass CORS allows all content types    Restrict Content-Type in CORS
8. Flash/Java plugin        crossdomain.xml too permissive   Deprecated (Flash dead)
```

##### CSRF token best practices

```
DO:
  â”€ Generate tokens with cryptographically secure random (not Math.random)
  â”€ Bind token to user session (different token per user)
  â”€ Expire token after session timeout
  â”€ Rotate token on login / privilege escalation
  â”€ Use httpOnly cookies for token storage (not localStorage)
  â”€ Validate token server-side for EVERY state-changing request

DON'T:
  âŒ Use GET to mutate state
  âŒ Expose CSRF token in URL parameters (leaks in Referer header)
  âŒ Use same token for all users
  âŒ Use predictable tokens (timestamp, user ID hash)
  âŒ Skip CSRF for "internal" API calls (they're not internal if reachable)
  âŒ Disable CSRF for mobile apps (they should use JWT/auth headers instead)
```

---

### 10.6 Database & Data Security

#### Row-Level / Per-Row Access Control

```
Every user can ONLY access data they own.

Implementations per backend:

  Supabase:     RLS (Row Level Security) â€” policy per table (recommended for Nuxt)
  Laravel:      Policies / Gates + where clauses scoped to user
  Node:         Middleware that adds user_id filter to every query
  ASP.NET:      Repository pattern filtering by user identity
  PostgreSQL:   Row-Level Security native (same as Supabase)
  MongoDB:      Query always includes owner filter

PATTERN: Never trust the client to scope their own data.
  âŒ Client sends: GET /api/projects (no filter â€” server must add WHERE user_id = auth_user)
  âœ… Server adds:  WHERE client_id IN (SELECT id FROM clients WHERE auth_user_id = $currentUser)

Laravel:
  $projects = Project::whereHas('client', fn($q) => 
    $q->where('auth_user_id', auth()->id())
  )->get();

Node:
  const projects = await prisma.project.findMany({
    where: { client: { authUserId: req.user.id } }
  });

ASP.NET:
  var projects = _context.Projects
    .Where(p => p.Client.AuthUserId == currentUserId)
    .ToListAsync();
```

#### Column-Level Encryption

```
SENSITIVE DATA THAT SHOULD BE ENCRYPTED:
  â”€ Payment method details (already handled by Stripe) â€” never touch raw card data
  â”€ Client notes containing personal information
  â”€ Contract terms / NDA content
  â”€ Internal admin notes about clients
  â”€ API keys for third-party services

PostgreSQL (pgcrypto):        MySQL (AES_ENCRYPT):
  pgp_sym_encrypt(data, key)    AES_ENCRYPT(data, key)
  pgp_sym_decrypt(data, key)    AES_DECRYPT(data, key)

MongoDB:                       Application-level (Any):
  Automatic Encryption (CSFLE)  crypto.createCipheriv('aes-256-gcm', key, iv)
```

#### Immutable Audit Log

```
ALL sensitive actions must be logged and never deleted.

TABLE DESIGN (any database):
  activity_log
  â”œâ”€â”€ id (auto-increment / UUID)
  â”œâ”€â”€ actor_id (who did it)
  â”œâ”€â”€ actor_type (admin / client / system)
  â”œâ”€â”€ action (created / updated / deleted / status_changed / paid / login / logout)
  â”œâ”€â”€ entity_type (client / project / invoice / order / message / settings)
  â”œâ”€â”€ entity_id
  â”œâ”€â”€ metadata (JSON â€” previous values, new values, IP, user agent)
  â”œâ”€â”€ ip_address
  â”œâ”€â”€ user_agent
  â””â”€â”€ created_at (TIMESTAMP)

RULES:
  â”€ INSERT only (no UPDATE, no DELETE policies)
  â”€ Never prune this table automatically â€” archive to cold storage after 1 year
  â”€ Index on (entity_type, entity_id) for fast lookups
  â”€ Index on (created_at) for time-based queries
  â”€ Index on (actor_id) for user history

WHAT TO LOG:
  âœ… Login / logout (success + failure)
  âœ… Create / update / delete of any entity (client, project, invoice, order)
  âœ… Status changes (leadâ†’client, draftâ†’sent, unpaidâ†’paid)
  âœ… Payment events
  âœ… Password changes
  âœ… MFA enrollment / removal
  âœ… Settings changes
  âŒ Never log passwords, tokens, or full credit card numbers
```

---

### 10.7 File Upload & Malware Protection

#### Upload Validation Pipeline (7 Layers)

```
Layer 1: File extension check (whitelist: .pdf, .jpg, .png, .webp, .docx, .zip)
Layer 2: MIME type check (server-side, not client-reported)
Layer 3: Magic byte verification (read first bytes of actual file)
Layer 4: Size limit enforcement (10MB default)
Layer 5: Malware scanning (ClamAV or cloud API)
Layer 6: Filename sanitization (strip path traversal, UUID rename)
Layer 7: Store outside webroot (never in public/ or www/)

MALWARE SCANNING OPTIONS:
  â”€ ClamAV (free, self-hosted): clamscan command or php-clamav
  â”€ VirusTotal API (cloud): submit file hash, check against 70+ scanners
  â”€ Google Cloud Vision / AWS Rekognition: detect inappropriate content
  â”€ Supabase Storage: no built-in scanning. Add via Edge Function (Deno) or webhook
```

##### Laravel Upload

```php
public function upload(Request $request) {
    $request->validate([
        'file' => [
            'required',
            'file',
            'max:10240', // 10MB in KB
            'mimes:pdf,jpg,jpeg,png,webp,docx,zip',
            // Custom rule for magic bytes
            new MagicByteRule(['%PDF', '\xFF\xD8\xFF', '\x89PNG']),
        ]
    ]);

    $file = $request->file('file');
    $uuid = Str::uuid();
    $ext = $file->getClientOriginalExtension();
    $filename = $uuid . '.' . $ext;

    // ClamAV scan
    $scan = Process::run(['clamscan', '--stdout', $file->path()]);
    if (!$scan->successful()) {
        Log::warning('Malware detected', ['file' => $filename, 'user' => auth()->id()]);
        return response()->json(['error' => 'File rejected by security scan'], 422);
    }

    $path = $file->storeAs('uploads/' . date('Y/m'), $filename, 'private');

    return response()->json(['path' => $path]);
}
```

##### Node.js Upload

```js
const multer = require('multer');
const clamav = require('clamav.js');
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.diskStorage({
    destination: '/tmp/uploads',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, uuidv4() + ext);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp',
                     'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                     'application/zip'];
    cb(null, allowed.includes(file.mimetype));
  },
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  // ClamAV scan
  const scanner = await clamav.createScanner(3310, '127.0.0.1');
  const result = await scanner.scanFile(req.file.path);
  if (result.isInfected) {
    fs.unlinkSync(req.file.path);
    return res.status(422).json({ error: 'File rejected by security scan' });
  }
  // Store to final location (S3, Supabase, local disk outside webroot)
  res.json({ path: req.file.filename });
});
```

#### Path Traversal Prevention

```php
// Laravel â€” use Storage facade (prevents path traversal by design)
Storage::disk('private')->get($path); // $path never resolves to ../ outside root

// Node â€” strip all path traversal characters
const safeName = path.basename(originalName); // strips all directory components
const safePath = path.join(__dirname, '../storage/uploads', uuid + ext);

// NEVER trust user-supplied paths:
// âŒ fs.readFileSync('/var/data/' + req.params.filename)
// âœ… fs.readFileSync(path.join('/var/data', path.basename(req.params.filename)))
```

#### Executable Upload Prevention

```php
// BLOCKED EXTENSIONS (never allow these, regardless of MIME):
$blocked = ['php', 'php3', 'php4', 'php5', 'phtml', 'exe', 'bat', 'sh',
            'cmd', 'com', 'cgi', 'pl', 'py', 'rb', 'asp', 'aspx',
            'jsp', 'war', 'jar', 'dll', 'so', 'bin', 'app', 'msi'];

// Double extension check:
//  file.php.jpg â†’ blocked (contains .php in name)
//  file.jpg.php â†’ blocked by extension check
//  file.php     â†’ blocked

// SVGs are dangerous (XSS via embedded <script> or onload attributes)
// UPLOAD SVG only if absolutely needed, and sanitize with DOMPurify first.
```

---

### 10.8 API Security

#### Rate Limiting (All Endpoints)

```
GLOBAL API RATE LIMITS (per IP):
  â”€ Auth endpoints:       5 req/min
  â”€ Public endpoints:     30 req/min
  â”€ Authenticated CRUD:   60 req/min
  â”€ File upload:          5 req/min
  â”€ Stripe webhook:       120 req/min (whitelisted IPs)
  â”€ Contact form:         2 req/min (anti-spam)
  â”€ Newsletter subscribe: 3 req/min (anti-spam)
```

##### Laravel

```php
// App\Http\Kernel.php
protected $middlewareGroups = [
    'api' => [
        'throttle:api', // 60 req/min by default
    ],
];

// Per-route
Route::middleware('throttle:5,1')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
});
```

##### Node.js

```js
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({ windowMs: 60000, max: 5 });
const apiLimiter = rateLimit({ windowMs: 60000, max: 60 });

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);
```

##### ASP.NET

```csharp
builder.Services.AddRateLimiter(options => {
    options.AddFixedWindowLimiter("Api", config => {
        config.PermitLimit = 60;
        config.Window = TimeSpan.FromMinutes(1);
    });
});
app.UseRateLimiter();
```

#### CORS Configuration â€” Comprehensive

##### What CORS protects against

Cross-Origin Resource Sharing (CORS) is a browser security mechanism that controls which domains can read your API responses. Without proper CORS, a malicious website could:

```
1. User visits attacker.com â† has your API open in background
2. Browser automatically sends cookies (if SameSite not Strict)
3. Attacker reads your API response â†’ steals client data
4. Attacker performs actions as the logged-in user â†’ CSRF-style attack

CORS BLOCKS THIS by telling the browser:
  "Only https://yourdomain.com is allowed to read this response"
```

##### CORS architecture â€” How it works

```
Browser                          Your API Server
  â”‚                                      â”‚
  â”‚  OPTIONS /api/clients                â”‚  â† Preflight (for non-simple requests)
  â”‚  Origin: https://evil.com            â”‚
  â”‚                                      â”‚
  â”‚  Access-Control-Allow-Origin:        â”‚  â† Server MUST specify allowed origins
  â”‚    https://yourdomain.com            â”‚     If evil.com not in list â†’ browser BLOCKS
  â”‚  Access-Control-Allow-Credentials    â”‚
  â”‚                                      â”‚
  â”‚  GET /api/clients                    â”‚  â† Actual request
  â”‚  Origin: https://yourdomain.com      â”‚
  â”‚  Cookie: session=xxx                 â”‚
  â”‚                                      â”‚
  â”‚  Access-Control-Allow-Origin:        â”‚  â† Response allowed â†’ browser passes to JS
  â”‚    https://yourdomain.com            â”‚
```

##### ðŸš¨ CRITICAL: Common CORS Mistakes That Get You Hacked

```diff
- âŒ Access-Control-Allow-Origin: *
  â†’ Any website can read your API responses
  â†’ UNDEFEATED by credentials: true (browser blocks this combo anyway)
  â†’ But WITHOUT credentials, attacker can still read public/non-auth data

- âŒ Reflecting Origin header without validation
  â†’ Server reads Origin header and echoes it back
  â†’ Attacker sends Origin: https://evil.com â†’ Server allows it
  â†’ COMPLETE BYPASS of CORS protection

- âŒ Access-Control-Allow-Origin: null
  â†’ Sandboxed iframes, data: URIs, file: protocols can use null origin
  â†’ Allows any page loaded from file:// or sandboxed context to read data

- âŒ Overly permissive origins with credentials
  â†’ Allow-Origin: https://*.yourdomain.com
  â†’ Subdomain takeover â†’ https://evil.yourdomain.com â†’ reads all client data

- âŒ Allowing all methods and headers
  â†’ Access-Control-Allow-Methods: *
  â†’ Access-Control-Allow-Headers: *
  â†’ Bypasses intended restrictions on what operations are allowed

- âŒ CORS policy too loose for admin endpoints
  â†’ Admin dashboard API allows origins other than your own domain
  â†’ XSS on any allowed domain = instant admin access
```

##### Correct CORS by backend

###### Laravel

```php
// config/cors.php
return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'], // Sanctum for SPA auth
    'allowed_methods' => ['GET', 'POST', 'PATCH', 'DELETE'],
    'allowed_origins' => [
        env('APP_URL', 'https://amin670bd.com'),
        env('FRONTEND_URL', 'https://amin670bd.com'), // Separate frontend domain
    ],
    'allowed_origins_patterns' => [], // Avoid patterns with wildcards for security
    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'X-CSRF-TOKEN',   // Laravel CSRF
        'X-Socket-Id',    // Laravel Echo / WebSockets
    ],
    'exposed_headers' => [
        'X-RateLimit-Remaining', // Expose rate limit info if needed
    ],
    'max_age' => 86400, // Cache preflight for 24 hours (reduces OPTIONS calls)
    'supports_credentials' => true, // Required for cookie-based auth (Sanctum / Session)
];
```

###### Node.js / Express

```js
const cors = require('cors');

const ALLOWED_ORIGINS = [
  'https://amin670bd.com',
  'https://www.amin670bd.com',
  'https://admin.amin670bd.com',
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (server-to-server, Postman, curl)
    if (!origin) return callback(null, true);
    
    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, origin); // Explicit origin (never use '*')
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Required for cookies / Authorization headers
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'X-CSRF-Token',
  ],
  exposedHeaders: ['X-RateLimit-Remaining'],
  maxAge: 86400, // 24 hours â€” cache preflight
};

app.use(cors(corsOptions));

// OPTIONS handler (Express cors middleware handles this, but explicit is safer)
app.options('*', cors(corsOptions));
```

###### ASP.NET Core

```csharp
// Program.cs
var allowedOrigins = new[] {
    "https://amin670bd.com",
    "https://www.amin670bd.com",
    "https://admin.amin670bd.com",
};

builder.Services.AddCors(options => {
    options.AddPolicy("AgencyPolicy", policy => {
        policy
            .WithOrigins(allowedOrigins)    // Explicit origins only
            .AllowCredentials()              // For cookie/JWT auth
            .WithMethods("GET", "POST", "PATCH", "DELETE")
            .WithHeaders(
                "Content-Type",
                "Authorization",
                "X-Requested-With",
                "X-CSRF-TOKEN"
            )
            .WithExposedHeaders("X-RateLimit-Remaining")
            .SetPreflightMaxAge(TimeSpan.FromHours(24));
    });
});

// Apply to controllers
app.UseCors("AgencyPolicy");
```

###### Nuxt / Nitro

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  nitro: {
    cors: {
      origin: [
        'https://amin670bd.com',
        'https://www.amin670bd.com',
      ],
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true,
      preflight: {
        statusCode: 204,
      },
    },
  },
});
```

###### Nginx (Reverse Proxy â€” any backend)

```nginx
server {
    listen 443 ssl;
    server_name api.amin670bd.com;

    # Handle preflight
    if ($request_method = 'OPTIONS') {
        add_header 'Access-Control-Allow-Origin' 'https://amin670bd.com';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, DELETE, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Max-Age' 86400;
        add_header 'Content-Type' 'text/plain charset=UTF-8';
        add_header 'Content-Length' 0;
        return 204;
    }

    # Actual requests
    location /api/ {
        # Dynamic origin validation (use map for multiple origins)
        set $cors_origin '';
        if ($http_origin ~ '^https?://(amin670bd\.com|www\.amin670bd\.com)$') {
            set $cors_origin $http_origin;
        }

        add_header 'Access-Control-Allow-Origin' $cors_origin always;
        add_header 'Access-Control-Allow-Credentials' 'true' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PATCH, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN' always;
        add_header 'Access-Control-Max-Age' 86400 always;

        proxy_pass http://localhost:3000;
    }
}
```

###### Cloudflare Workers (Edge CORS)

```js
// Cloudflare Worker â€” set CORS at edge before request hits origin
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const origin = request.headers.get('Origin');
  const allowedOrigins = [
    'https://amin670bd.com',
    'https://www.amin670bd.com',
  ];

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowedOrigins.includes(origin) ? origin : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  const response = await fetch(request);
  Object.keys(corsHeaders).forEach(key => {
    response.headers.set(key, corsHeaders[key]);
  });

  return response;
}
```

##### CORS by auth strategy

| Auth Method | `credentials: true` | Why |
|-------------|---------------------|-----|
| **Session cookie** (Laravel Sanctum, Nuxt/Supabase, Express-session) | âœ… Required | Browser sends cookies cross-origin |
| **JWT in Authorization header** (Bearer token) | âŒ Not needed | JS explicitly sends header â€” no cookies |
| **JWT in cookie** | âœ… Required | Same as session cookie |
| **API keys** (no user context) | âŒ Not needed | No credentials to leak |
| **OAuth2 callback** | âœ… Required | Redirect-based flow |

##### CORS in development

```js
// Development only â€” NEVER use in production
if (process.env.NODE_ENV === 'development') {
  const cors = require('cors');
  app.use(cors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',   // Vite
      'http://localhost:8080',
    ],
    credentials: true,
  }));
}
```

> ðŸš¨ **NEVER** put localhost in production CORS config. Use environment variables to switch.

##### CORS + CSP â€” Defense in depth

CORS and CSP work together but protect different things:

```
CORS: "Which domains can READ my API responses?"
CSP:  "Which domains can my page LOAD resources from?"

When properly configured together:
  â”€ CSP prevents XSS from loading malicious scripts
  â”€ CORS prevents stolen API responses from being read
  â”€ Even if CSP fails, CORS still protects API data
  â”€ Even if CORS misconfigured, CSP limits what scripts can execute
```

##### CORS validation test

```bash
# Test preflight response
curl -X OPTIONS https://api.amin670bd.com/api/clients \
  -H "Origin: https://evil.com" \
  -H "Access-Control-Request-Method: GET" \
  -v 2>&1 | grep -i "access-control"

# If response includes Access-Control-Allow-Origin: https://evil.com â†’ YOU ARE HACKED
# Correct response: no Access-Control-Allow-Origin header (or only your domain)

# Test with your real domain
curl -X OPTIONS https://api.amin670bd.com/api/clients \
  -H "Origin: https://amin670bd.com" \
  -H "Access-Control-Request-Method: GET" \
  -v 2>&1 | grep -i "access-control"
# Should return: Access-Control-Allow-Origin: https://amin670bd.com
```

##### CORS golden rules (expanded)

```
CORS GOLDEN RULES:
  â”€ Never use Access-Control-Allow-Origin: *  (except truly public APIs)
  â”€ Never reflect the Origin header without strict validation
  â”€ Never use Access-Control-Allow-Origin: null
  â”€ Never allow credentials + wildcard origin (browser blocks this anyway)
  â”€ Never allow *.yourdomain.com if you have any subdomain takeover risk
  â”€ Always return explicit origin, never wildcards
  â”€ Restrict methods to only what you use (GET, POST, PATCH, DELETE)
  â”€ Restrict headers to only what you send (Content-Type, Authorization...)
  â”€ Use supports_credentials/credentials: true ONLY if you use cookie auth
  â”€ Cache preflight with maxAge to reduce OPTIONS requests
  â”€ Validate on every deploy: use curl to test with evil origin
  â”€ Differentiate dev vs prod CORS via environment variables
  â”€ For admin-only APIs, restrict to your admin domain specifically
  â”€ Monitor CORS errors in production (Sentry captures them)
```

#### Request Size Limits

```nginx
# Nginx (any backend)
client_max_body_size 12M;

# Apache
LimitRequestBody 12582912
```

```php
// Laravel
// Already handled by PHP's upload_max_filesize and post_max_size

// Node.js (Express)
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ASP.NET
builder.WebHost.ConfigureKestrel(options => {
    options.Limits.MaxRequestBodySize = 12 * 1024 * 1024; // 12MB
});
```

#### API Keys & Secrets Management

```
NEVER commit secrets to version control.

  âœ… .env files (never committed)
  âœ… Environment variables in deployment platform
  âœ… Vault / AWS Secrets Manager / Azure Key Vault
  âŒ Hardcoded in source code
  âŒ Committed .env.example with real values

Environment separation:
  â”€ .env.local (local dev, not in git)
  â”€ .env.production (server environment variables)
  â”€ .env.example (template with placeholder values)

Rotation policy:
  â”€ API keys rotated every 90 days
  â”€ Database passwords rotated every 180 days
  â”€ JWT signing keys rotated every 30 days
```

---

### 10.9 Payment Security (Stripe / PayPal)

#### PCI DSS Compliance

```
CRITICAL: You NEVER handle card data directly.

  Stripe.js / Elements â†’ browser sends card data directly to Stripe
  Your server receives tokenized references only:
    - pi_xxxxxxxx (Payment Intent ID)
    - pm_xxxxxxxx (Payment Method ID)
    - in_xxxxxxxx (Invoice ID)

This means:
  âœ… No card numbers stored in your database
  âœ… No CVV stored anywhere
  âœ… No expiry dates stored
  âœ… PCI SAE A (simplest self-assessment) applies
  âŒ Never log raw Stripe responses that might contain card data
  âŒ Never send card data to your own server
```

#### Webhook Signature Verification (All Backends)

```
Every incoming webhook MUST verify its signature.

Laravel (Cashier handles this):   Node:
  Auto for Cashier webhooks         const sig = req.headers['stripe-signature'];
                                    stripe.webhooks.constructEvent(req.body, sig, secret);

ASP.NET:                            Python (Django):
  Stripe.EventUtility               stripe.Webhook.construct_event(
    .ConstructEvent(body, sig,       payload, sig_header, endpoint_secret
     secret, tolerance)
```

#### Idempotency

```
Every payment mutation uses an idempotency key:
  If a request is retried (network timeout), Stripe returns the same result
  instead of charging the customer twice.

  Key format: `${action}_${entityId}_${timestamp}`
  Example:    `checkout_client_abc123_1678901234`

Stripe automatically handles this when you pass idempotencyKey option.
For other payment providers: implement manually using database locking.
```

#### Payment Verification Flow

```
SERVER-SIDE FLOW (never trust the client):
  1. Client completes Stripe Checkout â†’ redirected to /success?session_id=xxx
  2. Your server calls stripe.checkout.sessions.retrieve(session_id)
  3. Verify payment_status === 'paid'
  4. Verify amount_total matches expected price
  5. Verify customer email or client ID
  6. Only then: update order status, grant access, send receipt
  7. Also handle via webhook (duplicate detection â€” idempotent)
```

---

### 10.10 Infrastructure & Deployment Security

#### SSL/TLS (Any Hosting)

```
  âœ… TLS 1.3 only (disable 1.0, 1.1, 1.2 if possible)
  âœ… HSTS preload: Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  âœ… Strong ciphers only (no RC4, DES, 3DES, MD5)
  âœ… Auto-renewal via Let's Encrypt or cloud provider
  âœ… OCSP Stapling enabled

  Nginx:
    ssl_protocols TLSv1.3;
    ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1h;
    ssl_stapling on;

  Apache:
    SSLProtocol -all +TLSv1.3
    SSLCipherSuite TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256
    SSLHonorCipherOrder on
```

#### Security Headers (Any Server)

```
Every response should include:

  Header                              Value
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  X-Content-Type-Options             nosniff
  X-Frame-Options                    DENY
  X-XSS-Protection                   0 (deprecated but defense-in-depth)
  Referrer-Policy                    strict-origin-when-cross-origin
  Permissions-Policy                 camera=(), microphone=(), geolocation=(self), payment=(self)
  Strict-Transport-Security          max-age=31536000; includeSubDomains; preload
  Content-Security-Policy            (see section 10.4)
```

##### Nginx

```nginx
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "0";
add_header Referrer-Policy "strict-origin-when-cross-origin";
add_header Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(self)";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload";
```

##### Apache (.htaccess)

```apache
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "DENY"
Header always set X-XSS-Protection "0"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=(self), payment=(self)"
Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
```

##### Cloudflare / CDN

```
If using Cloudflare (free tier recommended for all deployments):
  â”€ Auto HTTPS rewrites
  â”€ WAF (Web Application Firewall) with OWASP ruleset
  â”€ Bot Fight Mode (block automated attacks)
  â”€ Rate limiting (free: 1M requests/month)
  â”€ DDoS mitigation (unlimited free tier)
  â”€ Always Use HTTPS (redirect HTTP â†’ HTTPS)
  â”€ Browser Integrity Check (blocks malicious visitors)
  â”€ Under Attack Mode (emergency DDoS protection)
```

#### WAF & DDoS Protection (Vendor Agnostic)

```
LAYERED DEFENSE:

  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚  Cloudflare / DDoS-Guard (edge)         â”‚  â† DDoS mitigation, bot blocking, WAF
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚  Nginx / Apache / Caddy (server)         â”‚  â† Rate limiting, IP allowlist
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚  Application Framework (Laravel/Node)    â”‚  â† App-level rate limiting, CSRF, auth
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚  Database (PostgreSQL / MySQL)           â”‚  â† RLS, parameterized queries
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

SELF-HOSTED (VPS):
  â”€ Fail2Ban for SSH brute force + HTTP 401/403 monitoring
  â”€ iptables/nftables for connection rate limiting
  â”€ Docker with read-only root filesystem
  â”€ Automatic security updates (unattended-upgrades)

MANAGED HOSTING:
  â”€ Vercel / Netlify / Heroku built-in DDoS protection
  â”€ AWS Shield Standard (free)
  â”€ Cloudflare Free Plan (recommended as front for any origin)
```

#### Dependency Vulnerability Scanning

```
  Laravel:    composer audit (built-in)
  Node:       npm audit, Snyk, Dependabot (GitHub auto)
  Nuxt:       npx nuxi build --analyze (detects vulnerabilities)
  ASP.NET:    dotnet list package --vulnerable
  Docker:     docker scout, Trivy, Snyk container scanning

FREQUENCY:
  â”€ CI/CD pipeline: block build if any CRITICAL vulnerability
  â”€ Weekly: automated scan via GitHub Actions / GitLab CI
  â”€ Monthly: manual review of all dependencies
  â”€ Immediate: update on critical CVE announcement

GOLDEN RULE: Keep dependencies up to date. Most hacks exploit known CVEs.
```

---

### 10.11 Malware & Bot Protection

#### Bot Detection (All Deployments)

```
CAPTCHA STRATEGY:
  â”€ Login: invisible reCAPTCHA v3 or Cloudflare Turnstile (privacy-friendly)
  â”€ Contact form: Turnstile or hCaptcha (no tracking)
  â”€ Newsletter signup: honeypot field + Turnstile
  â”€ Checkout: Stripe Radar (built-in fraud detection)

HONEYPOT (hidden field, zero user friction):
  <input type="text" name="website" style="position:absolute;left:-9999px" tabindex="-1" autocomplete="off">
  // If website field has a value â†’ it's a bot â†’ silently reject

RATE LIMITING (see 10.8):
  Contact form: 2 req/min/IP
  Subscribe:    3 req/min/IP
  Login:        5 req/min/IP

IP REPUTATION:
  â”€ Cloudflare: automatic (block known malicious IPs)
  â”€ MaxMind / ipinfo.io: check IP score on critical actions
  â”€ Block known VPN/proxy IPs for admin login
```

#### Malware Upload Scanning

```
  SELF-HOSTED: ClamAV
    â”€ Free, open-source, extremely effective
    â”€ Run as daemon: clamd (port 3310)
    â”€ Scan via PHP, Node, Python, or direct command
    â”€ Signature updates: 3-4 times per day (freshclam, auto)
    â”€ Detection rate: 95%+ of known malware

  CLOUD API:
    â”€ VirusTotal (submit + hash check): 500 requests/day free
    â”€ Google Safe Browsing: check URLs in messages
    â”€ MetaDefender Cloud: paid, multi-engine scanning

  BLOCKED FILE TYPES USED IN MALWARE CAMPAIGNS:
    .exe, .bat, .cmd, .com, .scr, .pif, .reg, .vbs, .js
    .docm (macro-enabled), .xlsm, .pptm
    .hta, .ps1, .sh, .bash, .php, .py, .rb, .jar, .wasm
```

#### SQL Injection & NoSQL Injection (Automated Detection)

```
  â”€ Laravel: Eloquent ORM (auto-parameterized)
  â”€ Node: Prisma / Sequelize + NEVER raw queries with concatenation
  â”€ ASP.NET: Entity Framework (auto-parameterized)
  â”€ Python: Django ORM / SQLAlchemy (auto-parameterized)

  ADDITIONAL:
  â”€ WAF rule for SQLi patterns: ' OR 1=1--, UNION SELECT, WAITFOR DELAY
  â”€ Cloudflare WAF includes SQLi + XSS rule sets
  â”€ Fail2Ban jail for HTTP 400/500 responses containing SQL errors
```

---

### 10.12 Environment-Specific Hardening

#### VPS / Dedicated Server (DigitalOcean, Linode, Hetzner, OVH)

```
  â”€ SSH: key-only auth, disable password, port 2222 (non-default)
  â”€ Firewall: ufw / iptables â€” allow only 80, 443, SSH port
  â”€ Fail2Ban: jails for SSH, HTTP auth, Nginx 404/403 floods
  â”€ Automatic security updates: unattended-upgrades (apt)
  â”€ AppArmor / SELinux: enforce application confinement
  â”€ Read-only root filesystem for Docker containers
  â”€ Regular off-site backups (to S3 or Backblaze B2)
  â”€ Monitoring: Netdata / Prometheus + Grafana (resource usage, anomalies)
  â”€ Intrusion detection: ossec / wazuh / aide (file integrity)
```

#### Shared Hosting (cPanel, DirectAdmin)

```
  â”€ File permissions: 644 for files, 755 for directories
  â”€ .env file outside public_html (parent directory)
  â”€ Disable directory listing (Options -Indexes)
  â”€ Cloudflare proxied DNS (hides your origin IP)
  â”€ PHP disable_functions: exec, shell_exec, system, passthru, popen, proc_open
  â”€ MySQL user permissions: only GRANT needed tables (no DROP/ALTER)
  â”€ Regular File Integrity Check: tripwire or cPanel has built-in
  â”€ Separate DB user per application (never use root)
```

#### Serverless (Vercel, Netlify, AWS Lambda, Cloudflare Workers)

```
  â”€ Function timeout: keep under 30 seconds (default for most)
  â”€ Memory limit: 128-512MB (prevent resource exhaustion)
  â”€ No local filesystem (ephemeral â€” upload to S3/Supabase immediately)
  â”€ Cold start: no secrets in function output/logs
  â”€ Max function payload: 10MB (AWS API Gateway) / 4.5MB (Vercel)
  â”€ Environment variables: always via platform UI (never in code)
  â”€ WAF at CDN level (Cloudflare in front)
  â”€ Rate limiting at edge (Cloudflare WAF or platform built-in)
```

#### Docker / Container (Any Cloud)

```dockerfile
# Dockerfile best practices
FROM node:20-alpine AS base
RUN apk add --no-cache clamav clamav-libunrar     # Malware scanning
RUN freshclam                                       # Update virus definitions

FROM base AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .

USER node                                          # Never run as root
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1
```

```yaml
# docker-compose.yml
services:
  app:
    build: .
    read_only: true                       # Read-only root FS
    tmpfs:
      - /tmp:size=100M                    # Temp storage in memory
    cap_drop: ALL                         # Drop all Linux capabilities
    cap_add:                              # Add back only what's needed
      - NET_BIND_SERVICE
    security_opt:
      - no-new-privileges:true           # Prevent privilege escalation
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

---

### 10.13 Error Handling & Information Leakage

#### Universal Rules

```
  â”€ Never expose stack traces to the client
  â”€ Never expose internal error codes or file paths
  â”€ Never expose database schema info in error messages
  â”€ Never expose environment variable names
  â”€ Always log the full error server-side
  â”€ Always return a sanitized message to the client
```

##### Laravel

```php
// .env production
APP_DEBUG=false

// App\Exceptions\Handler.php
public function render($request, Throwable $e) {
    if ($request->expectsJson()) {
        $status = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        return response()->json([
            'error' => $this->getSafeMessage($e),
            'request_id' => request()->id, // For support reference
        ], $status);
    }
    return parent::render($request, $e);
}

private function getSafeMessage(Throwable $e): string {
    if ($e instanceof ValidationException) return $e->getMessage();
    if ($e instanceof AuthenticationException) return 'Unauthenticated';
    if ($e instanceof AuthorizationException) return 'Forbidden';
    if ($e instanceof ModelNotFoundException) return 'Resource not found';
    return 'An unexpected error occurred'; // Catch-all â€” never reveal internals
}
```

##### Node.js

```js
// middleware/errorHandler.js
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message, { stack: err.stack, requestId: req.id });

  const safeMessages = {
    ValidationError: 'Invalid input. Please check your data.',
    UnauthorizedError: 'Authentication required.',
    ForbiddenError: 'You do not have permission.',
    NotFoundError: 'Resource not found.',
  };

  res.status(err.status || 500).json({
    error: safeMessages[err.name] || 'An unexpected error occurred.',
    requestId: req.id,
  });
});
```

##### ASP.NET

```csharp
// Program.cs (production)
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler(errorApp => {
        errorApp.Run(async context => {
            var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
            Log.Error(exception, "Unhandled exception");
            
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = 500;
            
            await context.Response.WriteAsJsonAsync(new {
                error = "An unexpected error occurred.",
                traceId = Activity.Current?.Id ?? context.TraceIdentifier
            });
        });
    });
}
```

---

### 10.14 Backup & Disaster Recovery

#### Backup Strategy (Any Database)

```
  â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
  â”‚ Type     â”‚ Frequency            â”‚ Retention              â”‚
  â”œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¤
  â”‚ Full DB  â”‚ Daily                â”‚ 30 days                â”‚
  â”‚ WAL      â”‚ Continuous (PG)      â”‚ 7 days (PITR)          â”‚
  â”‚ Files    â”‚ Daily (incremental)  â”‚ 30 days                â”‚
  â”‚ Config   â”‚ On change            â”‚ Git history (forever)  â”‚
  â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”´â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜

OFF-SITE REQUIREMENT:
  â”€ Backups MUST be stored in a different geographic region
  â”€ Backups MUST be encrypted (AES-256)
  â”€ Restoration test: monthly
  â”€ Recovery Time Objective (RTO): 4 hours
  â”€ Recovery Point Objective (RPO): 24 hours
```

##### PostgreSQL (Any Deployment)

```bash
# pg_dump to S3 (daily cron)
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME \
  --format=custom --compress=9 \
  | aws s3 cp - s3://your-backup-bucket/db/$(date +%Y/%m/%d).dump \
  --sse AES256

# Point-in-time recovery (Supabase, RDS, CloudSQL, self-hosted with WAL)
```

##### MySQL / MariaDB

```bash
# mysqldump to S3 (daily cron)
mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME \
  --single-transaction --routines --triggers --events \
  | gzip \
  | aws s3 cp - s3://your-backup-bucket/db/$(date +%Y/%m/%d).sql.gz \
  --sse AES256
```

##### File Storage Backup

```bash
# Supabase Storage / S3 / Local files â†’ Backup
aws s3 sync s3://your-app-files s3://your-backup-bucket/files/$(date +%Y/%m/%d) \
  --sse AES256 --delete
```

#### Disaster Recovery Playbook

```
1. Server compromised / data breach
   â”€ Immediately: Take the app offline (maintenance page)
   â”€ Immediately: Revoke all API keys, rotate DB passwords
   â”€ Within 15 min: Restore last clean backup to a fresh server
   â”€ Within 1 hour: Identify breach vector, patch vulnerability
   â”€ Within 24 hours: Notify affected clients (legal requirement)

2. Database corruption
   â”€ Stop the app
   â”€ Restore from last known good backup
   â”€ Verify data integrity (row counts, foreign keys)
   â”€ Re-apply any transactions from WAL logs (PITR)
   â”€ Bring app back online

3. DDOS attack
   â”€ Enable Cloudflare Under Attack Mode immediately
   â”€ Rate limit all endpoints aggressively
   â”€ If targeted IP range: block at firewall level
   â”€ Scale up server resources temporarily
   â”€ File abuse report with hosting provider

4. Compromised admin credentials
   â”€ Force password reset immediately
   â”€ Revoke all active sessions
   â”€ Check audit log for unauthorized actions
   â”€ Review and revert any unauthorized changes
   â”€ Enable MFA if not already active
   â”€ Notify clients if client data was accessed
```

---

### 10.15 Compliance & Legal

#### GDPR (If serving EU clients)

```
  â”€ Right to access: Export client data as JSON/CSV (dashboard feature)
  â”€ Right to rectification: Client can update profile in portal
  â”€ Right to erasure: DELETE client â€” cascade to all linked data (invoices exempt for 7 years)
  â”€ Right to portability: Export in machine-readable format (JSON)
  â”€ Data Processing Agreement (DPA): Required with Supabase, Stripe, Resend
  â”€ Cookie consent: Minimal (session cookies only). No analytics/tracking cookies
  â”€ Data retention: Automated cleanup of old data
  â”€ Breach notification: Must notify DPA within 72 hours
  â”€ Data Protection Officer (DPO): For small business, you act as DPO
```

#### Data Retention Schedule

```
  Data Type             Retention                  Legal Basis
  â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  Clients               Indefinite (until deleted)  Legitimate interest
  Invoices              7 years                     Tax/legal requirement
  Contracts             7 years after expiry        Legal requirement
  Expense receipts      7 years                     Tax/legal requirement
  Activity logs         1 year                      Security
  Messages              3 years after last message  Legitimate interest
  Subscribers           Until unsubscribed          Consent
  Support tickets       3 years                     Legitimate interest
  Session data          24 hours                    Operational
  Temporary uploads     24 hours                    Operational
  Backups               30 days (daily)             Operational
```

#### Security Logs Retention

```
  â”€ Auth logs: 1 year (failed + successful logins)
  â”€ API request logs: 90 days
  â”€ Error logs: 30 days (server), 90 days (application)
  â”€ Audit trail: See activity_log table (never deleted, archive after 1 year)
  â”€ Payment logs: 7 years (legal requirement)
```

#### Audit Logging Requirements

```
All of the following MUST be logged with immutable audit trail:

  [1] User authentication events (login, logout, failed login)
  [2] User management (create, update, delete)
  [3] Client data access (view, export)
  [4] Financial events (invoice sent, payment received, refund)
  [5] Orders (create, update status, cancel)
  [6] Sensitive settings changes (email config, payment keys)
  [7] MFA enrollment / removal
  [8] Password changes / resets
  [9] Data export / bulk operations
  [10] API key generation / revocation
```

---

### 10.16 Monitoring & Incident Response

#### Real-Time Alerting

```
TRIGGER                                 ACTION
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
> 5 failed logins in 5 minutes          Email + SMS alert to admin
403/404 spike (> 50 in 1 min)           Email alert (possible scan attack)
File upload > 10MB                      Log + alert (possible malicious upload)
Payment webhook failure                 Immediate email + retry queue
Server CPU > 90% for 5 min             Cloudflare Under Attack Mode + email
SSL certificate expiring (< 7 days)     Daily email reminder
Backup failure                          Immediate email
New account created                     Email notification
High-value transaction (> $1000)        Email confirmation

IMPLEMENTATION:
  Laravel:    Notifications via mail + Slack + SMS (Twilio)
  Node:       nodemailer + webhook integrations
  ASP.NET:    SignalR + email provider
  Universal:  Sentry (error tracking + alerting)
```

#### Security Incident Response Plan

```
PREPARATION (Before Incident):
  â”€ Designated response lead (you)
  â”€ Runbook documented (this checklist)
  â”€ Backups tested monthly
  â”€ Security tools configured (monitoring, alerting)
  â”€ Legal counsel contact (optional for solo agency)

DETECTION:
  â”€ Automated alerts (see above)
  â”€ Periodic manual review of audit logs
  â”€ User reports suspicious activity

CONTAINMENT:
  1. Put the app in maintenance mode
  2. Block the attacker IP (Cloudflare WAF / iptables)
  3. Revoke all active sessions
  4. Rotate all secrets (DB, API keys, JWT secret)

ERADICATION:
  1. Identify root cause from logs
  2. Patch the vulnerability
  3. Remove any backdoors / malicious files
  4. Run full malware scan (ClamAV)
  5. Verify no unauthorized user accounts exist

RECOVERY:
  1. Restore from clean backup if necessary
  2. Bring app back online (remove maintenance mode)
  3. Monitor for re-occurrence
  4. Update security measures to prevent repeat

POST-MORTEM (Within 48 hours):
  1. Root cause analysis document
  2. Timeline of events
  3. What was affected (data, users, systems)
  4. What was fixed
  5. What will change to prevent recurrence
   6. Regulatory notification (if required)
```

---

### 10.17 SSRF (Server-Side Request Forgery)

##### What SSRF is

```
SSRF forces the server to make requests to internal resources that should not be
accessible from the outside. The attacker sends a URL that the server fetches,
and the server inadvertently exposes internal services.

CRITICAL IMPACT IN THIS APP:
  If your server fetches URLs from user input (webhook URLs, invoice PDF generation,
  email link preview, document import), an attacker could:

  1. Scan your internal network (192.168.x.x, 10.x.x.x, 172.16.x.x)
  2. Access cloud metadata endpoints:
     - AWS: http://169.254.169.254/latest/meta-data/
     - GCP: http://metadata.google.internal/
     - Azure: http://169.254.169.254/metadata/instance
  3. Probe internal services (Redis, PostgreSQL, Elasticsearch without auth)
  4. Read local files via file:// protocol
  5. Reach container orchestration APIs (Docker socket, Kubernetes API)
```

##### SSRF attack scenarios in this app

```
SCENARIO 1: Webhook delivery
  â”€ Admin configures a webhook URL for order notifications
  â”€ Enters: http://169.254.169.254/latest/meta-data/iam/security-credentials/
  â”€ Server makes request â†’ leaks AWS credentials

SCENARIO 2: URL preview / link scraping
  â”€ Message system generates link previews
  â”€ Client sends: file:///etc/passwd
  â”€ Server reads local file â†’ exposes system users

SCENARIO 3: Invoice PDF generation
  â”€ System fetches external CSS/JS for PDF rendering
  â”€ URL: http://192.168.1.1/status â†’ internal network scan

SCENARIO 4: OAuth / SSO callbacks
  â”€ OAuth flow includes redirect_uri parameter
  â”€ Attacker changes redirect_uri to internal endpoint
  â”€ Authorization code sent to attacker-controlled internal service

SCENARIO 5: Document import from URL
  â”€ Admin imports invoice from external URL
  â”€ URL: gopher://internal-db:6379/_FLUSHALL â†’ Redis command injection
```

##### SSRF prevention

###### Layer 1: URL validation allowlist

```php
// Laravel â€” validate webhook URLs strictly
use Illuminate\Support\Facades\Validator;

$validator = Validator::make($request->all(), [
    'webhook_url' => [
        'required',
        'url',
        function ($attribute, $value, $fail) {
            $parsed = parse_url($value);
            $allowedSchemes = ['https']; // Only HTTPS, never HTTP
            $allowedHosts = [
                'hooks.stripe.com',
                'api.resend.com',
                'hooks.slack.com',
            ];

            if (!in_array($parsed['scheme'], $allowedSchemes)) {
                return $fail('Only HTTPS URLs are allowed.');
            }

            // Block internal/reserved IP ranges
            $host = gethostbyname($parsed['host']);
            if (filter_var($host, FILTER_VALIDATE_IP)) {
                if (!filter_var($host, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $fail('URL points to a private/internal network.');
                }
            }

            if (!in_array($parsed['host'], $allowedHosts)) {
                return $fail('Webhook URL not in allowed list.');
            }
        },
    ],
]);
```

###### Layer 2: Block dangerous protocols

```php
// PHP â€” strip dangerous URL schemes
$blockedSchemes = ['file', 'gopher', 'dict', 'ftp', 'ldap', 'tftp', 'phar'];

$parsed = parse_url($url);
if (in_array($parsed['scheme'], $blockedSchemes)) {
    throw new \Exception('URL scheme not allowed');
}
```

```js
// Node â€” use IP-range-blocking HTTP client
const isDangerousURL = (url) => {
  const parsed = new URL(url);
  const dangerousProtocols = ['file:', 'gopher:', 'dict:', 'ftp:', 'ldap:'];
  const privateIPPattern = /^(127\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.|0\.|169\.254\.|::1|fc00:|fe80:)/;
  
  if (dangerousProtocols.includes(parsed.protocol)) return true;
  if (privateIPPattern.test(parsed.hostname)) return true;
  if (parsed.hostname === 'localhost' || parsed.hostname === '0.0.0.0') return true;
  if (parsed.hostname.endsWith('.internal') || parsed.hostname.endsWith('.local')) return true;
  
  return false;
};

// Use axios with DNS resolution blocking
const dns = require('dns');
const net = require('net');

const resolveAndCheck = (hostname) => {
  return new Promise((resolve, reject) => {
    dns.resolve4(hostname, (err, addresses) => {
      if (err) return reject(err);
      for (const addr of addresses) {
        if (net.isIP(addr) && !net.isIPv6(addr)) {
          const parts = addr.split('.').map(Number);
          if (parts[0] === 10) return reject(new Error('Private IP blocked'));
          if (parts[0] === 127) return reject(new Error('Loopback blocked'));
          if (parts[0] === 169 && parts[1] === 254) return reject(new Error('Link-local blocked'));
          if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return reject(new Error('Private IP blocked'));
          if (parts[0] === 192 && parts[1] === 168) return reject(new Error('Private IP blocked'));
        }
      }
      resolve(addresses);
    });
  });
};
```

```python
# Python â€” requests with URL safety check
import ipaddress
import socket
from urllib.parse import urlparse

BLOCKED_SCHEMES = ['file', 'gopher', 'dict', 'ftp', 'ldap', 'tftp', 'phar']
PRIVATE_NETWORKS = [
    ipaddress.ip_network('10.0.0.0/8'),
    ipaddress.ip_network('172.16.0.0/12'),
    ipaddress.ip_network('192.168.0.0/16'),
    ipaddress.ip_network('127.0.0.0/8'),
    ipaddress.ip_network('169.254.0.0/16'),
    ipaddress.ip_network('::1/128'),
    ipaddress.ip_network('fc00::/7'),
    ipaddress.ip_network('fe80::/10'),
]

def is_safe_url(url):
    parsed = urlparse(url)
    if parsed.scheme in BLOCKED_SCHEMES:
        return False
    hostname = parsed.hostname
    if hostname in ('localhost', '0.0.0.0') or hostname.endswith('.local'):
        return False
    try:
        ip = ipaddress.ip_address(socket.gethostbyname(hostname))
        for network in PRIVATE_NETWORKS:
            if ip in network:
                return False
    except:
        return False
    return True
```

###### Layer 3: Network-level blocking

```bash
# iptables â€” block outbound to private IPs from application (fail-safe)
# Place these rules early in the FORWARD or OUTPUT chain

# Block outbound to private IPv4 ranges (prevents SSRF even if app code fails)
iptables -A OUTPUT -d 10.0.0.0/8 -j REJECT
iptables -A OUTPUT -d 172.16.0.0/12 -j REJECT
iptables -A OUTPUT -d 192.168.0.0/16 -j REJECT
iptables -A OUTPUT -d 127.0.0.0/8 -j REJECT
iptables -A OUTPUT -d 169.254.0.0/16 -j REJECT
iptables -A OUTPUT -d 0.0.0.0/8 -j REJECT

# Allow only specific outbound services (default-deny)
iptables -A OUTPUT -p tcp -d hooks.stripe.com --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp -d api.resend.com --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp -d api.stripe.com --dport 443 -j ACCEPT
iptables -A OUTPUT -p tcp -d *.supabase.co --dport 443 -j ACCEPT

# Default deny outbound (whitelist approach)
iptables -A OUTPUT -j REJECT
```

```yaml
# Docker â€” network isolation (prevents SSRF to other containers)
# Use a separate network for outbound-only services
networks:
  app_network:
    internal: false  # Can reach internet
  internal_network:
    internal: true   # Cannot reach internet (DB, Redis, etc.)

services:
  app:
    networks:
      - app_network
      - internal_network  # App CAN reach internal_network containers

  db:
    networks:
      - internal_network  # Database ONLY on internal network
    # Database CANNOT reach internet or app's public interfaces
```

```yaml
# Kubernetes â€” NetworkPolicy to restrict egress
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: app-egress-restrict
spec:
  podSelector:
    matchLabels:
      app: agency
  policyTypes:
    - Egress
  egress:
    - to:
        - ipBlock:
            cidr: 0.0.0.0/0
            except:
              - 10.0.0.0/8
              - 172.16.0.0/12
              - 192.168.0.0/16
              - 169.254.0.0/16
      ports:
        - protocol: TCP
          port: 443
        - protocol: TCP
          port: 80
```

###### Layer 4: Dedicated SSRF-safe HTTP client

```php
// Laravel â€” custom HTTP client with SSRF protection
use Illuminate\Support\Facades\Http;

Http::macro('safe', function () {
    return Http::withOptions([
        'timeout' => 5,
        'connect_timeout' => 3,
        'verify' => true, // Verify SSL certificates
        'allow_redirects' => ['max' => 3, 'strict' => true],
        'curl' => [
            CURLOPT_PROTOCOLS => CURLPROTO_HTTPS, // Only HTTPS
            CURLOPT_REDIR_PROTOCOLS => CURLPROTO_HTTPS,
            CURLOPT_RESOLVE => [// Block internal hostnames at curl level
                '127.0.0.1:443:0.0.0.0',
                'localhost:443:0.0.0.0',
                '169.254.169.254:443:0.0.0.0',
            ],
        ],
    ]);
});

// Usage:
$response = Http::safe()->post($webhookUrl, $payload);
```

```bash
# Curl â€” SSRF-safe options (use in scripts)
curl --proto "=https" --proto-redir "=https" \
     --resolve "169.254.169.254:443:0.0.0.0" \
     --resolve "metadata.google.internal:443:0.0.0.0" \
     --connect-timeout 5 \
     --max-time 10 \
     "$URL"
```

##### SSRF-specific monitoring

```
ALERTS:
  â”€ Server makes HTTP request to private IP â†’ IMMEDIATE ALERT
  â”€ Server resolves internal hostname (.internal, .local) â†’ LOG + ALERT
  â”€ Server hits cloud metadata endpoint â†’ CRITICAL ALERT
  â”€ Outbound request to unusual port (not 80/443) â†’ LOG + REVIEW
  â”€ DNS query for internal hostnames from application â†’ LOG

IMPLEMENTATION:
  â”€ Log all outbound HTTP requests (URL, resolved IP, timing)
  â”€ DNS query logging (bind, dnsmasq, or systemd-resolved)
  â”€ Outbound proxy with audit (Squid, mitmproxy in logging mode)
```

---

### 10.18 URL Injection / Open Redirect / Host Header Injection

##### URL Injection (Unvalidated Redirects & Forwards)

```
ATTACK:
  Attacker crafts a URL that passes validation but redirects the user to a
  malicious site. The user trusts the original domain and follows the redirect.

  https://amin670bd.com/redirect?url=https://evil.com/login
  â†’ User sees amin670bd.com domain, trusts it
  â†’ Redirected to evil.com login page (phishing)
  â†’ Enters credentials â†’ stolen

WHERE THIS APPLIES TO YOUR APP:
  â”€ After login: /dashboard/login?redirect=/dashboard/clients
  â”€ After checkout: /store/success?redirect=/portal/invoices
  â”€ Email links: /unsubscribe?token=xxx&redirect=...
  â”€ Payment return: /stripe/return?session_id=xxx
  â”€ External link icons in dashboard
```

##### Open redirect prevention

```php
// Laravel â€” validate redirect URLs strictly
use Illuminate\Support\Str;

function safeRedirect($url) {
    $parsed = parse_url($url);
    $allowedHosts = [
        'amin670bd.com',
        'www.amin670bd.com',
        'dashboard.amin670bd.com',
    ];

    // Only allow relative paths (recommended)
    if (Str::startsWith($url, '/') && !Str::startsWith($url, '//')) {
        return $url; // Safe â€” same origin
    }

    // If absolute URL, validate host (strict)
    if (isset($parsed['host'])) {
        if (!in_array($parsed['host'], $allowedHosts)) {
            return '/'; // Fallback to home
        }
        return $url;
    }

    return '/';
}

// Usage in controller:
return redirect(safeRedirect($request->input('redirect', '/')));
```

```js
// Node â€” whitelist-based redirect validation
const ALLOWED_REDIRECT_DOMAINS = [
  'amin670bd.com',
  'www.amin670bd.com',
  'dashboard.amin670bd.com',
];

const safeRedirect = (url) => {
  try {
    const parsed = new URL(url, 'https://amin670bd.com'); // Base for relative URLs
    
    // Relative URLs are always safe
    if (url.startsWith('/') && !url.startsWith('//')) {
      return url;
    }

    // Absolute URLs â€” validate domain
    if (!ALLOWED_REDIRECT_DOMAINS.includes(parsed.hostname)) {
      return '/';
    }

    // Block protocol-relative URLs (//evil.com)
    if (url.startsWith('//')) {
      return '/';
    }

    // Block javascript: URLs
    if (parsed.protocol === 'javascript:') {
      return '/';
    }

    return parsed.toString();
  } catch {
    return '/'; // Invalid URL â†’ safe fallback
  }
};

// Middleware
app.use('/api/redirect', (req, res) => {
  res.redirect(safeRedirect(req.query.url));
});
```

```csharp
// ASP.NET â€” safe redirect
public IActionResult SafeRedirect(string returnUrl)
{
    // Use LocalRedirect for relative URLs only
    if (Url.IsLocalUrl(returnUrl))
    {
        return LocalRedirect(returnUrl);
    }
    return RedirectToAction("Index", "Home");
}
```

##### Open redirect checklist

```
  â”€ NEVER use user input directly in redirect() / Location: header
  â”€ ALWAYS validate against an allowlist
  â”€ PREFER relative paths over absolute URLs
  â”€ Block protocol-relative URLs (//evil.com)
  â”€ Block javascript: / data: / vbscript: schemes
  â”€ Block URLs with @ character (https://real.com@evil.com)
  â”€ Block encoded URLs (URL decode before validation)
  â”€ Use hash-based redirect mapping instead of raw URLs:
    â†’ Instead of ?redirect=/dashboard
    â†’ Use ?redirect=dashboard (lookup table on server)
  â”€ Return 400 for invalid redirect (don't silently redirect to home)
```

##### Host header injection

```
ATTACK:
  Attacker sends a request with a modified Host header:
    GET / HTTP/1.1
    Host: evil.com

  If the app uses Host header to generate URLs (password reset, redirects),
  the attacker can inject their domain into trusted communications.

WHERE THIS AFFECTS YOUR APP:
  â”€ Password reset emails (link generated with Host header)
  â”€ Redirect URLs
  â”€ CSRF token generation (if domain-bound)
  â”€ Pagination links
  â”€ Webhook signature validation (if domain-bound)
```

```php
// Laravel â€” trust only specific hosts
// App\Http\Middleware\TrustHosts.php
protected function hosts()
{
    return [
        'amin670bd.com',
        'www.amin670bd.com',
        'dashboard.amin670bd.com',
        $this->allSubdomainsOfApplicationUrl(),
    ];
}

// OR validate manually
public function handle($request, Closure $next)
{
    $allowedHosts = ['amin670bd.com', 'www.amin670bd.com'];
    $host = $request->getHost();

    if (!in_array($host, $allowedHosts)) {
        abort(400, 'Invalid Host header');
    }

    return $next($request);
}
```

```nginx
# Nginx â€” reject invalid Host headers by default
# Only allow specific domains
if ($host !~* ^(amin670bd\.com|www\.amin670bd\.com)$) {
    return 444; # Close connection without response
}

# OR use server_name as gate (cleaner):
server {
    listen 443 ssl;
    server_name amin670bd.com www.amin670bd.com;
    
    # Any request not matching these server_names hits default_server â†’ 444
}

# Default catch-all (no server_name) â€” drop everything
server {
    listen 443 ssl default_server;
    return 444;
}
```

```apache
# Apache â€” restrict Host header
RewriteEngine On
RewriteCond %{HTTP_HOST} !^(amin670bd\.com|www\.amin670bd\.com)$
RewriteRule ^ - [F]
```

##### Host header injection prevention checklist

```
  â”€ Never trust the Host header for URL generation
  â”€ Use APPLICATION_URL environment variable as canonical base URL
  â”€ Validate Host header against allowlist
  â”€ Configure application URL explicitly (don't derive from request)
  â”€ Nginx/Apache: reject requests with unexpected Host headers
  â”€ For password reset / email links: always use configured APP_URL
  â”€ For webhooks: validate callback URL domain, not request Host
  â”€ TEST: curl -H "Host: evil.com" https://yourdomain.com
  â”€ TEST: curl -H "Host:" https://yourdomain.com (empty Host)
  â”€ TEST: curl -H "X-Forwarded-Host: evil.com" https://yourdomain.com
```

---

### 10.19 Kali Linux / Penetration Testing Attack Protections

##### Introduction

```
This section covers protection against attacks using Kali Linux and other
penetration testing frameworks. An attacker with Kali tools will attempt every
vector below within minutes of discovering your application.

YOUR DEFENSE IS LAYERED:
  1. Reduce attack surface (block what you don't need)
  2. Detect scanning (logging + alerting)
  3. Rate limit aggressively (slow down attackers)
  4. Harden configuration (no default creds, no debug info)
  5. WAF at edge (Cloudflare / ModSecurity)
  6. Fail2Ban / IP blocklists (automated response)
```

##### Tool-by-tool protection matrix

```
TOOL                WHAT IT DOES                    OUR DEFENSE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Nmap                Port scanning, OS detection      Firewall, stealth, port knocking
Metasploit          Exploit framework                Patch management, WAF, IDS
Hydra / Medusa      Brute force passwords            Rate limiting, MFA, lockout
John / Hashcat      Password hash cracking           bcrypt, slow hashes, pepper
SQLmap              Automated SQL injection          Parameterized queries, WAF
Dirbuster / Gobuster Directory/file brute force      404 monitoring, rate limiting
WPScan              WordPress vulnerability scan     N/A (custom app, but harden anyway)
Nikto               Web server scanner               Security headers, no info leakage
Burp Suite          Proxy + intercept + repeater     Input validation, CSRF, CSP, RLS
OWASP ZAP           Automated scanner                Same as Burp + full coverage
Aircrack-ng         WiFi attacks                     N/A (cloud-hosted, not relevant)
Bettercap           MITM, network attacks            TLS 1.3, HSTS, certificate pinning
Empire / Covenant   Post-exploitation                AppArmor, containers, read-only FS
Responder           LLMNR/NBT-NS poisoning           Cloud-hosted (not on same network)
John the Ripper     Password cracking                bcrypt (slow), lockout
Maltego             OSINT / information gathering    Minimize exposed info, security.txt
theHarvester        Email/domain enumeration         No exposed employee emails, aliases
Socat / Chisel      Tunneling/port forwarding        Egress firewall, network policies
```

##### Nmap protection

```
Nmap scans for:
  â”€ Open ports (22, 80, 443, 3306, 5432, 6379, 27017, 9200...)
  â”€ Running services + versions
  â”€ Operating system fingerprinting
  â”€ Firewall rules (ACK scan, FIN scan, NULL scan, Xmas scan)

DEFENSES:
```

```bash
# 1. Close ALL unnecessary ports
#    Only 80 (redirect to 443) and 443 should be open
#    NEVER expose DB ports (3306, 5432) to the internet
#    NEVER expose Redis (6379), Elasticsearch (9200), or admin panels

ufw default deny incoming
ufw default allow outgoing
ufw allow 443/tcp        # HTTPS
ufw deny 22/tcp          # SSH â€” move to non-standard port + key only
ufw enable

# 2. Port knocking (SSH access only via sequence)
#    Install knockd â€” SSH port stays closed until correct knock sequence
sudo apt install knockd
# knock 1000 2000 3000 â†’ opens SSH for 10 seconds

# 3. Stealth / decoy responses
#    Use a modern IDS/IPS that detects scan patterns (Snort, Suricata)

# 4. Rate limit connection attempts (per IP)
iptables -A INPUT -p tcp --dport 443 -m recent --name portscan --rcheck --seconds 60 -j DROP
iptables -A INPUT -p tcp --dport 443 -m recent --name portscan --set -j ACCEPT
# If an IP connects > 20 times in 60 seconds â†’ drop further connections

# 5. SYN flood protection
iptables -A INPUT -p tcp --syn -m limit --limit 1/s --limit-burst 3 -j ACCEPT
iptables -A INPUT -p tcp --syn -j DROP
```

```nginx
# 6. Nginx â€” hide server version (prevents service fingerprinting)
server_tokens off;
more_set_headers "Server: ";  # Requires ngx_headers_more

# 7. Return generic error pages (no OS/stack info)
error_page 400 /error.html;
error_page 403 /error.html;
error_page 404 /error.html;
error_page 500 /error.html;
```

```bash
# 8. Fail2Ban â€” detect and block Nmap scans
# /etc/fail2ban/jail.local
[portscan]
enabled = true
filter = portscan
logpath = /var/log/syslog
maxretry = 20
findtime = 60
bantime = 3600
action = iptables[name=PortScan, port=all, protocol=tcp]

# 9. Cloudflare â€” hides your origin IP
#    All traffic routes through Cloudflare
#    Origin IP only accessible to Cloudflare's IP ranges
#    Attacker scanning Cloudflare IPs sees nothing useful
```

##### Hydra / Medusa â€” brute force protection

```
Hydra attacks login forms, SSH, FTP, databases with dictionary attacks.
Typical rate: 10,000+ password attempts per minute per tool.
```

```php
// Laravel â€” multi-layer brute force protection
// Already covered in 10.2, but reinforcement:
protected function authenticated(Request $request, $user)
{
    // Log successful login
    activity()->log('login_success');

    // Check if previous failures exist for this IP
    $failures = Cache::get('login_failures_' . $request->ip(), 0);
    if ($failures > 5) {
        // Send alert â€” possible brute force success
        Alert::send('admin@domain.com', "Brute force may have succeeded for IP: " . $request->ip());
    }

    // Clear failure counter
    Cache::forget('login_failures_' . $request->ip());
}
```

```bash
# Fail2Ban â€” block Hydra at network level
# /etc/fail2ban/jail.local
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
logpath = /var/log/nginx/error.log
maxretry = 5
findtime = 60
bantime = 86400  # 24 hours

[nginx-auth]
enabled = true
filter = nginx-auth
logpath = /var/log/nginx/*access.log
maxretry = 10
findtime = 60
bantime = 86400
```

```
ADDITIONAL:
  â”€ CAPTCHA after 3 failed login attempts (Cloudflare Turnstile or hCaptcha)
  â”€ Progressive delay: 1s â†’ 5s â†’ 15s â†’ 60s between attempts
  â”€ Email alert after 5 failed attempts from same IP
  â”€ IP blocklist feeds (automatically feed IPs to Cloudflare WAF)
  â”€ Geo-blocking: if you only serve Bangladesh, block foreign IPs
```

##### SQLmap â€” automated SQL injection protection

```
SQLmap automatically detects and exploits SQL injection vulnerabilities.
```

```php
// Laravel â€” SQL injection is already impossible with Eloquent ORM
// But if you use raw SQL, enforce strict parameterization:

// âŒ VULNERABLE
DB::select("SELECT * FROM clients WHERE name = '$input'");

// âœ… SAFE â€” parameterized
DB::select("SELECT * FROM clients WHERE name = ?", [$input]);

// âœ… EVEN SAFER â€” Eloquent (auto-parameterized)
Client::where('name', $input)->get();
```

```sql
-- PostgreSQL â€” additional defense: strict typing
-- If you must accept raw input, validate type first:
CREATE FUNCTION search_clients(search_term TEXT)
RETURNS SETOF clients
LANGUAGE plpgsql
AS $$
BEGIN
    -- RETURN QUERY validates that search_term is treated as text, not SQL
    RETURN QUERY SELECT * FROM clients
        WHERE name ILIKE '%' || search_term || '%'
        OR email ILIKE '%' || search_term || '%';
END;
$$;

-- NOTICE: Even this RPC is safe because || concatenation in SQL
-- does NOT execute the content as SQL. SQLmap would fail here.
```

```bash
# WAF level â€” block SQL injection patterns before they reach app
# Nginx + ModSecurity (free WAF)
# /etc/nginx/modsec/main.conf
SecRule ARGS "@detectSQLi" "id:100,phase:2,deny,status:403,msg:'SQL Injection detected'"
SecRule ARGS "@detectXSS" "id:101,phase:2,deny,status:403,msg:'XSS detected'"

# Cloudflare WAF â€” enables OWASP ruleset + SQLi/XSS detection
# Already built into Cloudflare dashboard (free tier includes basic rules)
```

##### Dirbuster / Gobuster â€” directory brute force

```
These tools enumerate hidden directories and files by brute-forcing common names:
  /admin, /backup, /config, /.env, /wp-admin, /api-docs, /phpmyadmin
```

```bash
# 1. Return 404 for everything that doesn't exist (no 403 distinction)
#    This prevents attackers from distinguishing "exists but forbidden" vs "doesn't exist"
```

```nginx
# Nginx â€” catch-all returns 404, not 403
location / {
    try_files $uri $uri/ /index.php?$query_string;
}

# Explicit deny â€” return 404 not 403
location ~ /\.(env|git|svn|htaccess|htpasswd) {
    return 404;
}

location ~ /(config|backup|dump|sql|admin|phpmyadmin|api-docs) {
    return 404;
}
```

```bash
# 2. Rate-limit directory traversal attempts
# Fail2Ban â€” detect 404 scanning
# /etc/fail2ban/filter.d/nginx-scan.conf
[Definition]
failregex = ^<HOST>.*"(GET|POST|HEAD).*" 404

# /etc/fail2ban/jail.local
[nginx-scan]
enabled = true
filter = nginx-scan
logpath = /var/log/nginx/access.log
maxretry = 50
findtime = 60
bantime = 86400
```

```bash
# 3. Honeypot directories (optional)
#    Create /admin, /backup that log the visitor and block IP
mkdir -p public/admin
echo "<?php header('HTTP/1.0 404 Not Found'); log_visitor(); ?>" > public/admin/index.php
# log_visitor() records IP â†’ adds to Fail2Ban blocklist
```

```nginx
# 4. Cloudflare â€” challenge (CAPTCHA) on suspicious paths
# Page Rule: https://domain.com/admin* â†’ Security: Challenge (CAPTCHA)
# This blocks all directory brute force tools (they can't solve CAPTCHAs)
```

##### Metasploit â€” exploit protection

```
Metasploit contains thousands of exploits targeting unpatched software.
Your defense is: keep everything updated.
```

```bash
# 1. Automatic security updates (critical)
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 2. Docker â€” minimal base images
#    Use distroless or Alpine (fewer exploitable tools/binaries)
FROM node:20-alpine AS production
# vs. FROM ubuntu:latest (hundreds of exploitable packages)

# 3. Read-only filesystem (prevents writing payloads)
docker run --read-only --tmpfs /tmp ...

# 4. No root inside container
USER node

# 5. Drop all Linux capabilities
docker run --cap-drop ALL --cap-add NET_BIND_SERVICE ...

# 6. AppArmor / SELinux profiles
docker run --security-opt apparmor=your-profile ...

# 7. Rootless Docker (podman or rootless Docker daemon)
```

##### Burp Suite / OWASP ZAP â€” proxy attack protection

```
Burp Suite acts as a man-in-the-middle proxy, intercepting and modifying requests.

PROTECTIONS:
  â”€ TLS 1.3 with HSTS preload â†’ prevents downgrade attacks
  â”€ Certificate pinning (optional) â†’ blocks MITM proxies
  â”€ Input validation â†’ tampered parameters are rejected
  â”€ CSRF tokens â†’ replayed requests fail
  â”€ Rate limiting â†’ automated scanning slows down
  â”€ Request signature (HMAC) â†’ tampered requests detected

SPECIFIC BURP/ZAP ATTACKS WE PREVENT:
  â”€ Parameter tampering: All input validated server-side
  â”€ Replay attacks: CSRF tokens, idempotency keys, nonces
  â”€ Session hijacking: httpOnly + Secure cookies, short expiry
  â”€ JSON/XML injection: Content-Type validation, schema validation
  â”€ Race conditions: Database transactions, pessimistic locking
```

##### Password cracking protection (John / Hashcat)

```
  â”€ Passwords hashed with bcrypt (cost factor 12+) â†’ ~100ms per hash
  â”€ Hashcat on RTX 4090: ~10,000 bcrypt hashes/second (very slow)
  â”€ Same password on MD5: ~100 BILLION hashes/second
  â”€ Add pepper (server-side secret mixed into hash)
  â”€ Account lockout after 5 attempts â†’ attacker hashes are useless
  â”€ MFA â†’ password alone is insufficient
  â”€ Session invalidation on password change â†’ old hashes worthless
```

##### General anti-scanning / anti-probing measures

```nginx
# Nginx â€” generic attack surface reduction

# 1. Hide all server information
server_tokens off;
more_clear_headers 'Server';
more_clear_headers 'X-Powered-By';
more_clear_headers 'X-AspNet-Version';

# 2. Block common scanner user agents
map $http_user_agent $bad_bot {
    default 0;
    ~*(sqlmap|nikto|nmap|nessus|openvas|gobuster|dirbuster|wfuzz) 1;
    ~*(masscan|zmap|hydra|medusa|ncrack|patator|thc) 1;
    ~*(acunetix|netsparker|appscan|webinspect|burpsuite|zaproxy) 1;
    ~*(python-requests|python-urllib|go-http-client|curl|wget) 1;
}

if ($bad_bot) {
    return 444;
}

# 3. Block requests without common headers (bots often skip them)
if ($http_user_agent = "") {
    return 444;
}

# 4. Rate limit all requests per IP
limit_req_zone $binary_remote_addr zone=allips:10m rate=30r/s;
limit_req zone=allips burst=50 nodelay;
```

```bash
# Fail2Ban â€” comprehensive scan detection
# /etc/fail2ban/jail.local

[DEFAULT]
bantime = 86400
findtime = 600
maxretry = 5

[nginx-auth]
enabled = true
filter = nginx-auth
logpath = /var/log/nginx/access.log

[nginx-bad-request]
enabled = true
filter = nginx-bad-requests
logpath = /var/log/nginx/access.log
maxretry = 10

[nginx-scan]
enabled = true
filter = nginx-scan
logpath = /var/log/nginx/access.log
maxretry = 50

[sshd]
enabled = true
filter = sshd
logpath = /var/log/auth.log
maxretry = 3

[recidive]
enabled = true
filter = recidive
logpath = /var/log/fail2ban.log
maxretry = 3
bantime = 604800  # 1 week for repeated offenders
```

```bash
# Cloudflare â€” Security Level settings
# Set Security Level to HIGH
#   â†’ Challenges visitors with suspicious IP reputations
# Set Challenge Passage to 30 minutes
# Enable Bot Fight Mode
# Enable Browser Integrity Check
# Enable WAF with OWASP rules
# Rate limit: 20 req/10 seconds per IP on /api/*
# Block countries where you have no business (optional)
```

##### Security.txt â€” responsible disclosure

```
Create /.well-known/security.txt so security researchers can report findings:
```

```
Contact: mailto:security@amin670bd.com
Encryption: https://keys.openpgp.org/search?q=security@amin670bd.com
Acknowledgments: https://amin670bd.com/security-hall-of-fame
Policy: https://amin670bd.com/.well-known/security-policy.txt
Preferred-Languages: en, bn
Canonical: https://amin670bd.com/.well-known/security.txt
```

##### Penetration testing checklist (simulate Kali attacks before launch)

```
BEFORE GOING LIVE, RUN THESE TESTS:

[ ] Nmap scan from external IP:
      nmap -sV -sC -O -A yourdomain.com
      â†’ Only ports 80 and 443 should be open
      â†’ Server version should NOT be revealed

[ ] Nmap script scan:
      nmap --script http-enum,http-headers,http-methods yourdomain.com
      â†’ No sensitive directories exposed
      â†’ No dangerous HTTP methods (PUT, DELETE on public)

[ ] Hydra brute force:
      hydra -l admin -P /usr/share/wordlists/rockyou.txt yourdomain.com https-post-form "/login:user=^USER^&pass=^PASS^:F=Invalid"
      â†’ Must lock out after 5 attempts
      â†’ Rate limiting must block after 5 req/min

[ ] SQLmap:
      sqlmap -u "https://yourdomain.com/api/search?q=test"
      â†’ Must find ZERO vulnerabilities

[ ] Dirbuster / Gobuster:
      gobuster dir -u https://yourdomain.com -w /usr/share/wordlists/dirb/common.txt
      â†’ No .env, .git, admin, backup, config directories exposed

[ ] Nikto:
      nikto -h https://yourdomain.com
      â†’ Zero high-severity findings

[ ] OWASP ZAP:
      Full automated scan â†’ PASS (no critical/high findings)

[ ] SSL Labs (https://www.ssllabs.com/ssltest/):
      Grade A+

[ ] Security headers (https://securityheaders.com/):
      A+ rating (all headers present)

[ ] Host header injection:
      curl -H "Host: evil.com" https://yourdomain.com
      â†’ Must reject with 400 or 444

[ ] Path traversal:
      curl https://yourdomain.com/../../../etc/passwd
      â†’ 404 or 400, never exposes file

[ ] Open redirect:
      curl -I "https://yourdomain.com/redirect?url=https://evil.com"
      â†’ Must NOT redirect to evil.com

[ ] SSRF check:
      Internally verify no outbound traffic to private IPs

[ ] Dependency scan:
      npm audit / composer audit â†’ zero critical vulnerabilities

[ ] Rate limit test:
      ab -n 100 -c 10 https://yourdomain.com/api/products
      â†’ After ~30 req/min, must return 429
```

---

```
Pre-Launch Security Checklist
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
[ ] Authentication & Identity
    [ ] MFA enforced for admin account
    [ ] Password policy configured (12+ chars, mixed, 5 attempt lockout)
    [ ] Rate limiting on login endpoint (5 req/min)
    [ ] Session cookies: httpOnly, Secure, SameSite=Strict
    [ ] Session timeout configured (24h admin, 7d client with refresh)
    [ ] Refresh token rotation enabled
    [ ] No secrets in client-side JavaScript

[ ] Input Validation & Injection
    [ ] ALL API endpoints validate input (Zod/PHP attributes/Data Annotations)
    [ ] ALL database queries use parameterized input (never string concat)
    [ ] No eval(), exec(), or shell commands with user data
    [ ] File upload: MIME + magic byte + extension validation
    [ ] File upload: 10MB size limit enforced
    [ ] File upload: stored outside webroot, renamed to UUID
    [ ] Malware scanning on all uploads (ClamAV)
    [ ] URL validation on all redirects and webhook URLs

[ ] XSS & Client-Side
    [ ] CSP headers configured
    [ ] X-XSS-Protection, X-Content-Type-Options, X-Frame-Options set
    [ ] DOMPurify / HTML Purifier on all rich text
    [ ] All user output in templates is escaped by default

[ ] CSRF & CORS
    [ ] CSRF protection active on all state-changing requests
    [ ] CORS restrictively configured (only your domain)
    [ ] SameSite=Strict on session cookies
    [ ] GET requests are idempotent (no mutations)

[ ] Infrastructure & Deployment
    [ ] TLS 1.3 only, HSTS preload
    [ ] Security headers: Referrer-Policy, Permissions-Policy
    [ ] Environment variables: never in code, always in platform UI
    [ ] Dependencies: npm audit / composer audit â€” no critical vulns
    [ ] Docker: read-only filesystem, drop all capabilities
    [ ] Database: RLS or per-user scoping on all tables
    [ ] Database: encryption at rest enabled
    [ ] Backups configured + tested (point-in-time recovery)
    [ ] Rate limiting on all public endpoints
    [ ] WAF rules enabled (Cloudflare or nginx)

[ ] Logging & Monitoring
    [ ] Immutable audit trail (INSERT-only activity_log table)
    [ ] All auth events logged (login, logout, failure)
    [ ] All CRUD operations logged (who, what, when, IP)
    [ ] Payment events logged (with no card data!)
    [ ] Alerting configured for suspicious activity
    [ ] Sentry / error tracker integrated

[ ] Compliance
    [ ] GDPR: data export + delete features implemented
    [ ] Data retention schedule documented
    [ ] Privacy policy written and published
    [ ] Terms of service written and published
    [ ] Third-party DPAs collected (Supabase, Stripe, Resend)
    [ ] Cookie consent handled (if any non-essential cookies)

[ ] Penetration Testing
    [ ] OWASP ZAP scan: no critical findings
    [ ] Dependency vulnerability scan passed
    [ ] Manual test: try SQL injection on search/forms
    [ ] Manual test: try XSS on rich text fields
    [ ] Manual test: try path traversal on file downloads
    [ ] Manual test: try privilege escalation on API endpoints
    [ ] Load test: verify rate limiting works under pressure

[ ] Production Hardening
    [ ] Debug mode OFF (APP_DEBUG=false, NODE_ENV=production)
    [ ] Error pages: no stack traces, no file paths
    [ ] Error logging to file/Sentry (not client response)
    [ ] Firewall: only ports 80 and 443 open
    [ ] SSH: key-only, non-default port
    [ ] Fail2Ban or equivalent active
    [ ] Unused services disabled (FTP, Telnet, SMTP, etc.)
    [ ] Regular security updates (unattended-upgrades or equivalent)
    [ ] Security.txt published (/.well-known/security.txt)
```

---

### 10.20 JWT (JSON Web Token) Security

#### JWT Structure & Common Pitfalls

```
JWT STRUCTURE:
  header.payload.signature

  HEADER:    {"alg":"HS256","typ":"JWT"}
  PAYLOAD:   {"sub":"user_123","role":"admin","iat":1689000000,"exp":1689086400}
  SIGNATURE: HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), secret)

ALGORITHM CHOICE:
  â”€ HS256 (HMAC with SHA-256): Symmetric â€” same secret signs and verifies
    â†’ Good for single-service apps (secret never leaves your server)
    â†’ Risk: secret must be extremely strong (> 256 bits)
  â”€ RS256 (RSA with SHA-256): Asymmetric â€” private key signs, public key verifies
    â†’ RECOMMENDED for microservices / third-party verification
    â†’ Public key can be distributed safely
    â†’ Slower than HS256 but worth the security gain
  â”€ ES256 (ECDSA with SHA-256): Asymmetric, elliptic curve
    â†’ Faster than RS256, smaller keys
    â†’ Good for mobile / IoT clients
  âŒ NEVER use: "none" algorithm, HS256 with weak secret, algorithm confusion attacks
```

#### Algorithm Confusion Attack

```php
// CRITICAL: Prevent algorithm confusion (RS256 public key used as HS256 secret)
// Laravel â€” ensure 'required' algorithm is enforced
JWT::parser()->setBlacklist(new \Lcobucci\JWT\Signer\Key\InMemory($publicKey));
JWT::parser()->build(new \Lcobucci\JWT\Parser());

// Always validate algorithm explicitly:
$token = JWT::decode($token, new Key($publicKey, 'RS256')); // â† Explicit algorithm
```

```js
// Node (jsonwebtoken) â€” always specify algorithms array
const jwt = require('jsonwebtoken');

// âŒ VULNERABLE â€” attacker changes alg from RS256 to HS256, uses public key as secret
const decoded = jwt.verify(token, publicKey); // No algorithms specified!

// âœ… SAFE â€” explicit algorithm enforcement
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });

// Verify issuer, audience, and expiry manually
const decoded = jwt.verify(token, publicKey, {
  algorithms: ['RS256'],
  issuer: 'https://auth.amin670bd.com',
  audience: 'https://api.amin670bd.com',
});
```

#### JWT Storage

```
JWT STORAGE OPTIONS (ranked by security):
  1. âœ… httpOnly + Secure + SameSite=Strict cookie
     â†’ CSRF protected, XSS cannot read token
     â†’ Best for web apps with same-origin API
     â†’ Required for Supabase auth cookie mode
  2. âš ï¸  In-memory variable (JS closure)
     â†’ XSS cannot read (not persisted in DOM)
     â†’ Lost on page refresh (must use refresh token)
     â†’ Complex implementation
  3. âŒ localStorage
     â†’ Any XSS instantly steals ALL tokens
     â†’ Subresource integrity attacks can steal
     â†’ NEVER use for auth tokens
  4. âŒ URL parameters / query string
     â†’ Leaked in Referer header, server logs, browser history
     â†’ NEVER pass JWT in URL

SUPABASE AUTH:
  Supabase stores the access token in localStorage by default.
  â†’ Mitigation: enable cookie-based auth (supabase-js v2 + @supabase/ssr)
  â†’ For Nuxt: use @supabase/ssr which stores in httpOnly cookies automatically
```

#### JWT Rotation & Revocation

```
ACCESS TOKEN (short-lived):
  â”€ Expiry: 15 minutes (admin), 1 hour (client)
  â”€ Stored in httpOnly cookie or memory
  â”€ No server-side check needed (stateless)
  â”€ If stolen: limited window of abuse

REFRESH TOKEN (long-lived):
  â”€ Expiry: 7 days (admin), 30 days (client with remember-me)
  â”€ Rotation: NEW refresh token issued every time one is used
  â”€ Old refresh token becomes INVALID immediately (rotation detection)
  â”€ If refresh token is reused (stolen + used by attacker):
    â†’ Both old AND new tokens are revoked
    â†’ User is forced to re-authenticate
    â†’ Attacker cannot maintain access without re-auth

REVOCATION STRATEGIES:
  â”€ Blacklist: Store revoked JWT IDs (jti claim) in Redis/Database
    â†’ Check against blacklist on every request
    â†’ Expire blacklist entries after token expiry (automatic cleanup)
  â”€ Short expiry: 15 min tokens â†’ stealing has limited window
  â”€ Incremental secret: Rotate JWT secret daily. Old tokens become invalid.
  â”€ User action triggers: On password change / MFA removal / suspicious login:
    â†’ Increment user's token version in DB â†’ all tokens for that user invalidated
```

#### JWT Claim Validation

```js
// Node â€” comprehensive JWT validation middleware
const jwtValidator = (req, res, next) => {
  const token = extractToken(req); // From cookie or Authorization header

  try {
    const decoded = jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
      issuer: 'https://auth.amin670bd.com',
      audience: 'https://api.amin670bd.com',
      clockTolerance: 30, // 30 seconds clock skew allowance
    });

    // Additional claim checks
    if (!decoded.role || !['admin', 'client'].includes(decoded.role)) {
      throw new Error('Invalid role claim');
    }

    // Check if token was issued after last password change
    if (decoded.iat < user.lastPasswordChange.getTime() / 1000) {
      throw new Error('Token issued before password change');
    }

    req.user = decoded;
    next();
  } catch (err) {
    // Log + return 401
    logger.warn('JWT validation failed', { error: err.message, ip: req.ip });
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
```

#### JWT Common Attacks & Defenses

```
ATTACK                           EXPLOIT                              DEFENSE
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Alg confusion (none)             alg: "none" â†’ no signature check    Reject "none" algorithm explicitly
Alg confusion (RSâ†’HS)            Use public key as HMAC secret        Explicit algorithms array
Token theft via XSS              Read JWT from localStorage           httpOnly cookie storage
Token replay                     Attacker reuses intercepted token    Short expiry + refresh rotation
JWK injection                    Inject malicious JWK in header       Validate against trusted JWKS URL
Timing attack on verification    Measure response time to guess keys  Constant-time comparison (default in libs)
Brute force weak secret          Crack HS256 with weak password      Use RS256 or > 256-bit HS256 secret
Unbounded payload                Giant payload â†’ DoS                  Limit token size (middleware check)
Session fixation                 Attacker sets known token            Rotate on login, never accept user token
```

#### Supabase JWT-Specific

```
Supabase uses JWTs for authentication. Key details:

  â”€ Signing: RS256 by default (JWKS endpoint for public keys)
  â”€ Claims: sub (user ID), aud, role (authenticated), email, app_metadata, user_metadata
  â”€ Custom claims: Via auth.users.raw_app_meta_data (set via SQL or dashboard)
  â”€ Service role key: Full access, NEVER expose to client
  â”€ Anon key: Public, RLS-restricted, safe to expose

  SUPABASE RLS WITH JWT:
    -- Extract user ID from JWT in RLS policies:
    CREATE POLICY "Users can only see their own data"
    ON clients
    FOR SELECT
    USING (auth.uid() = user_id);

    -- Custom claim check:
    CREATE POLICY "Admins can see all"
    ON clients
    FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

  ROTATION:
    â”€ Supabase auto-rotates JWKS keys
    â”€ Always fetch JWKS from: https://project.supabase.co/auth/v1/.well-known/jwks.json
    â”€ Cache JWKS with 1-hour TTL
```

---

### 10.21 WebSocket & Realtime Security

#### WebSocket Threat Model

```
HOW WEBSOCKETS DIFFER FROM HTTP:
  â”€ Persistent connection (no per-request auth)
  â”€ Bidirectional (server can push to client)
  â”€ No built-in CORS (browsers enforce on upgrade request only)
  â”€ No automatic cookie handling in all environments

THREATS:
  1. Unauthenticated connections â†’ attacker opens socket to eavesdrop
  2. No origin validation â†’ any website can connect on behalf of user
  3. Message injection â†’ attacker sends malformed messages
  4. No rate limiting â†’ attacker floods server with messages (DoS)
  5. No CSRF protection on upgrade â†’ attacker auto-connects using victim's cookies
  6. No message validation â†’ attacker sends oversized/script payloads
  7. Connection hijacking â†’ attacker steals WebSocket token
```

#### Supabase Realtime Security

```sql
-- Supabase Realtime uses PostgreSQL replication + WebSocket
-- Security is handled by RLS + replication filters

-- 1. Enable RLS for Realtime (REQUIRED for any sensitive data)
-- In Supabase dashboard: Replication â†’ your_table â†’ Enable RLS for Realtime

-- 2. Always filter in the subscription (server-side filter, not client)
-- Clients can only subscribe to channels they have access to

-- 3. Realtime RLS policy example:
CREATE POLICY "Clients can only see their own project updates"
ON projects
FOR SELECT  -- Realtime uses SELECT policy
USING (auth.uid() = client_auth_user_id);
```

```js
// Client â€” safe Supabase Realtime subscription pattern
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// âœ… SAFE â€” authentication is handled by the channel
const channel = supabase
  .channel('client-projects')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'projects',
      filter: `client_auth_user_id=eq.${user.id}`, // Server-filtered
    },
    (payload) => {
      // Handle realtime update
    }
  )
  .subscribe()

// âŒ NEVER subscribe to all records:
supabase
  .channel('all-projects')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, handler)
  .subscribe() // â† Leaks ALL project updates to this client
```

#### WebSocket Authentication (Non-Supabase)

```js
// Node (ws library) â€” authenticate on connection upgrade
const WebSocket = require('ws');
const jwt = require('jsonwebtoken');

const wss = new WebSocket.Server({ 
  port: 8080,
  verifyClient: (info, cb) => {
    // 1. Validate Origin header
    const origin = info.origin || info.req.headers.origin;
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return cb(false, 403, 'Origin not allowed');
    }

    // 2. Validate token from query string or cookie
    const token = new URL(info.req.url, 'http://localhost').searchParams.get('token');
    if (!token) {
      return cb(false, 401, 'Authentication required');
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['RS256'] });
      info.req.user = decoded;
      cb(true);
    } catch {
      cb(false, 401, 'Invalid token');
    }
  }
});

wss.on('connection', (ws, req) => {
  // Connection is authenticated â€” req.user is set
  logger.info('WebSocket connected', { user: req.user.sub });

  ws.on('message', (data) => {
    // Validate message size and format
    if (data.length > 1024 * 10) { // 10KB max
      ws.close(1009, 'Message too large');
      return;
    }

    try {
      const msg = JSON.parse(data);
      // Validate message schema
      if (!msg.type || !ALLOWED_MESSAGE_TYPES.includes(msg.type)) {
        ws.close(4001, 'Invalid message type');
        return;
      }
      // Process message
    } catch {
      ws.close(4001, 'Invalid JSON');
    }
  });
});
```

#### WebSocket Rate Limiting

```js
// Node â€” per-user WebSocket rate limit
const rateLimitMap = new Map(); // userId â†’ { count, resetTime }

wss.on('connection', (ws, req) => {
  const userId = req.user.sub;

  const messageLimiter = setInterval(() => {
    const entry = rateLimitMap.get(userId) || { count: 0, resetTime: Date.now() + 60000 };

    if (Date.now() > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = Date.now() + 60000;
    }

    ws._originalSend = ws.send;
    ws.send = (data) => {
      entry.count++;
      if (entry.count > 100) { // 100 messages per minute
        ws.close(1008, 'Rate limit exceeded');
        return;
      }
      ws._originalSend(data);
    };

    rateLimitMap.set(userId, entry);
  }, 1000);

  ws.on('close', () => clearInterval(messageLimiter));
});
```

#### WebSocket Security Checklist

```
  â”€ Authenticate on connection (not after). If auth fails, close immediately.
  â”€ Validate Origin header on upgrade (prevents CSWSH â€” Cross-Site WebSocket Hijacking)
  â”€ Use wss:// (TLS for WebSocket) â€” always, no exceptions
  â”€ Rate limit messages per connection (100 msg/min typical)
  â”€ Validate message schema server-side (don't trust client)
  â”€ Enforce maximum message size (10KB default)
  â”€ Close connection on invalid messages (don't ignore â€” attacker probes)
  â”€ No broadcast to unauthorized clients (server must verify per-recipient)
  â”€ Timeout idle connections (10 min timeout)
  â”€ Log connection/disconnection events for audit
  â”€ Supabase Realtime: ALWAYS use RLS + filtered subscriptions
  â”€ Supabase Realtime: NEVER subscribe without a filter
```

---

### 10.22 Email Security (SPF, DKIM, DMARC, BIMI)

#### Why Email Security Matters

```
Without proper email authentication, attackers can:
  â”€ Send phishing emails that appear to come from your domain
  â”€ Intercept password reset emails (domain reputation ruins deliverability)
  â”€ Damage your domain reputation â†’ legitimate emails go to spam
  â”€ Impersonate your agency to clients: "Send invoice payment to new account"

THREE AUTHENTICATION STANDARDS (all required):
  SPF   â€” Which servers are allowed to send email for your domain
  DKIM  â€” Cryptographic signature proving email wasn't tampered
  DMARC â€” Policy telling receivers what to do if SPF/DKIM fail
```

#### SPF â€” Sender Policy Framework

```dns
; DNS TXT record for amin670bd.com
; Lists all authorized email senders
amin670bd.com.  IN  TXT  "v=spf1 mx include:_spf.resend.com include:stripe.com -all"

; BREAKDOWN:
;   mx              â€” Your mail server (if you self-host email)
;   include:resend  â€” Resend's sending servers (your primary email provider)
;   include:stripe  â€” Stripe's sending servers (receipts, invoices)
;   -all            â€” STRICT FAIL: reject all other senders (RECOMMENDED)
;   ~all            â€” SOFT FAIL: mark as spam but don't reject (use during testing)
;   ?all            â€” NEUTRAL: no policy (equivalent to no SPF)

; COMMON INCLUDES:
;   include:_spf.google.com     â€” Google Workspace
;   include:spf.mandrillapp.com â€” Mailchimp Mandrill
;   include:spf.sendgrid.net    â€” SendGrid
;   include:amazonses.com       â€” AWS SES

; SPF LOOKUP LIMIT: max 10 DNS lookups total (each include counts as 1)
;   Check: https://spftest.net/
```

#### DKIM â€” DomainKeys Identified Mail

```dns
; DKIM uses a public key published in DNS
; Email is signed with private key by the sender
; Receiver verifies signature using your public key

; Resend DKIM (example):
;   Selector: resend._domainkey.amin670bd.com
resend._domainkey.amin670bd.com.  IN  TXT  "v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCIp6k6m0gB8cRanTB2YArXNqHjPTdR6a7+UfM9vG9k0mW8wFJ6V4t8zF5kPgGpLq0f6j0NnVwWJgQIDAQAB"

; Each email provider gives you their DKIM key.
; For Resend: Enable in Resend dashboard â†’ Domains â†’ Add DKIM
; For custom sending: Generate key pair, publish public key as shown above

; DKIM SELECTORS: You can have multiple (for different providers)
;   stripe._domainkey.amin670bd.com  â€” Stripe emails
;   google._domainkey.amin670bd.com  â€” Google Workspace
;   resend._domainkey.amin670bd.com  â€” Resend transactional emails

; KEY SIZE: 2048-bit RSA minimum (1024-bit is deprecated)
```

#### DMARC â€” Domain-Based Message Authentication, Reporting & Conformance

```dns
; DMARC policy tells receivers what to do when SPF/DKIM fail
_dmarc.amin670bd.com.  IN  TXT  "v=DMARC1; p=reject; rua=mailto:dmarc@amin670bd.com; ruf=mailto:dmarc-forensic@amin670bd.com; pct=100; fo=1"

; BREAKDOWN:
;   p=reject          â€” REJECT emails that fail authentication (RECOMMENDED for prod)
;   p=quarantine      â€” Send failures to spam (use during transition)
;   p=none            â€” Take no action, only report (use during initial setup)
;
;   rua=mailto:...    â€” Aggregate reports (daily XML summaries from receivers)
;   ruf=mailto:...    â€” Forensic reports (individual failure details)
;
;   pct=100           â€” Apply policy to 100% of emails (start at 10% to test)
;   fo=1              â€” Generate forensic report if either SPF or DKIM fails
;   aspf=r            â€” Strict SPF alignment (From domain must match SPF domain)
;   adkim=s           â€” Strict DKIM alignment (From domain must match DKIM domain)

; PHASED ROLLOUT (recommended):
;   Phase 1: p=none, monitor reports for 2 weeks
;   Phase 2: p=quarantine, pct=25 â†’ 50 â†’ 100 over 4 weeks
;   Phase 3: p=reject (final)
```

#### BIMI â€” Brand Indicators for Message Identification

```dns
; BIMI displays your logo next to verified emails in Gmail, Apple Mail, etc.
default._bimi.amin670bd.com.  IN  TXT  "v=BIMI1; l=https://cdn.amin670bd.com/brand/logo.svg; a=https://cdn.amin670bd.com/brand/bimi-cert.pem"

; REQUIREMENTS:
;   â”€ DMARC policy must be p=reject or p=quarantine
;   â”€ Logo must be SVG (Tiny PS profile)
;   â”€ Verified Mark Certificate (VMC) for blue checkmark (optional but recommended)
;   â”€ Logo must be hosted on HTTPS
```

#### Email Security Testing

```bash
# Check your current email security setup:
# 1. Use online tools:
#    https://www.mail-tester.com/          â€” Overall email health
#    https://dmarctester.com/              â€” DMARC validation
#    https://www.dmarcanalyzer.com/        â€” DMARC report analysis
#    https://mxtoolbox.com/dkim.aspx       â€” DKIM checker

# 2. Send test email and analyze headers:
#    Look for: Authentication-Results header
#    Authentication-Results: spf=pass smtp.mailfrom=resend.com;
#                           dkim=pass header.d=amin670bd.com;
#                           dmarc=pass header.from=amin670bd.com;

# 3. Command-line check:
dig TXT amin670bd.com +short
dig TXT _dmarc.amin670bd.com +short
dig TXT resend._domainkey.amin670bd.com +short
```

#### Application-Level Email Security

```php
// Laravel â€” prevent email spoofing in contact forms
// Validate the sender isn't using a forged From address

public function submitContactForm(Request $request) {
    // âŒ NEVER trust the From address in the form
    //    User could set from: "ceo@yourcompany.com" and impersonate you
    
    // âœ… ALWAYS set From to a known address, include user's real email in Reply-To
    $details = [
        'user_email' => $request->validated('email'), // Validate email format
        'user_name'  => $request->validated('name'),  // Validate name
        'message'    => $request->validated('message'),
    ];

    Mail::send('emails.contact', $details, function ($message) use ($details) {
        $message->from('noreply@amin670bd.com', 'Amin670BD Contact'); // Fixed From
        $message->replyTo($details['user_email'], $details['user_name']); // Real sender
        $message->to('contact@amin670bd.com');
    });
}
```

```js
// Node â€” prevent email header injection
const sendMail = async ({ name, email, message }) => {
  // âŒ VULNERABLE â€” email header injection
  // const text = `From: ${name}\nMessage: ${message}`; // â† Injects headers via \n

  // âœ… SAFE â€” use proper email library (Resend SDK handles this)
  const { Resend } = require('resend');
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: 'noreply@amin670bd.com',
    to: ['contact@amin670bd.com'],
    replyTo: email,
    subject: `Contact from ${name}`,
    html: `<p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
           <p>${escapeHtml(message)}</p>`,
  });
};
```

#### Email Security Checklist

```
  â”€ SPF record published with -all (hard fail)
  â”€ DKIM key published for each email provider
  â”€ DMARC policy at p=reject
  â”€ DMARC aggregate reports configured (monitor weekly)
  â”€ BIMI record set for brand logo display
  â”€ From address is NEVER user-supplied (always fixed per purpose)
  â”€ Reply-To header for user correspondence
  â”€ No email header injection possible (use SDK/library, not raw headers)
  â”€ Password reset links use https:// with configured APP_URL (not Host header)
  â”€ Email logs retained with delivery status (bounce tracking)
  â”€ Unsubscribe links present in marketing emails (CAN-SPAM compliance)
  â”€ Transactional and marketing emails use different sending domains
  â”€ Sender reputation monitored (MXToolbox, Google Postmaster Tools)
```

---

### 10.23 Supply Chain Security

#### Dependency Attack Vectors

```
YOUR APPLICATION'S SUPPLY CHAIN:

  npm packages (300+)     â†’    Your Nuxt App    â†’    Docker image    â†’    Deployed to Vercel
  â†“                               â†“                     â†“                        â†“
  Transitive deps (2000+)      Source code          Base image (alpine)      Vercel infra
  â†“                               â†“                     â†“                        â†“
  Typosquatting, compromised    Misconfigurations    CVE in base image       Shared tenant risk
  maintainer accounts, malware                      (libc, openssl, curl)   environment

COMMON ATTACKS:
  1. Typosquatting: published packages with similar names (left-pad â†’ Ieft-pad)
  2. Dependency confusion: private package name available on public npm â†’ npm install loads public one
  3. Malicious maintainer takeover: attacker gains npm publishing rights
  4. Compromised CI/CD: attacker injects malicious code during build
  5. Transitive dependency exploit: vulnerable sub-dependency you didn't know about
  6. Pre/post-install scripts: malicious code runs on npm install
```

#### Supply Chain Defense Layers

```json5
// 1. NPM configuration â€” enhance security
// .npmrc
strict-ssl=true
// Script blocking (prevents postinstall attacks)
ignore-scripts=true  // Then only run scripts for trusted packages
// Audit level
audit-level=high
// Lock file
package-lock=true
```

```json
// 2. Override vulnerable transitive dependencies
// package.json â€” force specific versions of sub-dependencies
{
  "overrides": {
    "minimatch": "^3.1.2",
    "json5": "^2.2.3",
    "semver": "^7.5.2",
    "tough-cookie": "^4.1.3"
  }
}
```

```yaml
# 3. GitHub Actions â€” supply chain security
# .github/workflows/ci.yml
name: Supply Chain Security

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Dependency review (checks new/modified deps in PRs)
      - uses: actions/dependency-review-action@v3

      # npm audit
      - name: npm audit
        run: npm audit --audit-level=high
        continue-on-error: false # Block CI on critical/high vulns

      # Snyk (free tier)
      - name: Snyk Security Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high

      # Trivy scan (container + filesystem)
      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
```

```yaml
# 4. Dependabot configuration
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "daily"
    open-pull-requests-limit: 10
    labels:
      - "dependencies"
      - "security"
    # Auto-merge patch updates only
    allow:
      - dependency-type: "production"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-major"]
```

#### SBOM â€” Software Bill of Materials

```bash
# Generate SBOM (SPDX or CycloneDX format)

# npm â€” generate CycloneDX SBOM
npx @cyclonedx/cyclonedx-npm --output-file sbom.json

# Alternatively use Syft (more comprehensive)
syft dir:. -o cyclonedx-json=sbom.json

# Verify SBOM against known vulnerabilities
# Grype (uses same vulnerability DB as Trivy)
grype sbom:sbom.json --fail-on high

# Upload SBOM to Dependency-Track (self-hosted)
# curl -X POST "https://dependency-track.example.com/api/v1/bom" \
#   -H "X-Api-Key: $API_KEY" \
#   -H "Content-Type: multipart/form-data" \
#   -F "project=your-project-uuid" \
#   -F "bom=@sbom.json"
```

#### Sigstore / Signing

```bash
# Sign your releases with Sigstore (cosign, keyless signing)
# No key management needed â€” uses OIDC identity

# 1. Install cosign
# 2. Sign your container image (keyless)
cosign sign --keyless ghcr.io/amin670bd/agency-app:latest

# 3. Verify
cosign verify --keyless ghcr.io/amin670bd/agency-app:latest

# 4. Sign your npm package
npm pack
npx sigstore sign amin670bd-agency-1.0.0.tgz

# 5. Verify npm audit signatures
npm audit signatures
```

#### Dependency Confusion Prevention

```bash
# Dependency Confusion: attacker publishes a package with the same name as
# your private package on the public registry. npm install resolves to public.
#
# Nuxt â€” scope all private packages:

# 1. Use @scope for all private packages
#    @amin670bd/utils, @amin670bd/ui-components

# 2. Force scoped packages to resolve only from private registry
# .npmrc
@amin670bd:registry=https://npm.pkg.github.com/amin670bd
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}

# 3. For unscoped packages, never rely on name collision prevention
#    Use unique, hard-to-guess names for private packages

# 4. Verify ALL npm installs show audit report:
npm audit --audit-level=high
```

#### Supply Chain Security Checklist

```
  â”€ npm audit runs in CI (blocks critical/high vulnerabilities)
  â”€ Dependabot or Renovate configured for auto-updates
  â”€ Lock file (package-lock.json) committed to git
  â”€ Override field in package.json for high-risk transitive deps
  â”€ Dependency review in GitHub PRs (new dependencies are reviewed)
  â”€ NPM scripts limited (ignore-scripts=true, only allow for trusted packages)
  â”€ No deprecated packages with known CVEs
  â”€ SBOM generated and stored per release
  â”€ Container images signed with cosign/Sigstore
  â”€ Dependency confusion prevented via scoped packages
  â”€ Snyk or similar SCA tool integrated
  â”€ Trivy or Docker Scout scanning in CI
  â”€ All third-party actions in CI pinned to full commit SHA (not tags)
  â”€ Node.js and npm versions pinned and updated regularly
```

---

### 10.24 Browser Security Features Deep Dive

#### Beyond CSP â€” Modern Browser Security Mechanisms

```
Browsers have evolved beyond CSP, X-Frame-Options, and X-XSS-Protection.
Modern features provide defense in depth against cross-origin attacks, XSS,
and side-channel vulnerabilities.

FEATURES COVERED:
  1. Cross-Origin Opener Policy (COOP)
  2. Cross-Origin Embedder Policy (COEP)
  3. Cross-Origin Resource Policy (CORP)
  4. Fetch Metadata (Sec-Fetch-* headers)
  5. Trusted Types
  6. Permissions Policy (replacing Feature Policy)
  7. Document Policy
  8. Subresource Integrity (SRI)
  9. Credential Management API restrictions
```

#### Cross-Origin Opener Policy (COOP)

```
WHAT IT PREVENTS:
  Cross-origin pages can reference your window via window.opener.
  Attack scenario:
    1. User clicks link â†’ opens https://evil.com in new tab
    2. evil.com can access window.opener.location
    3. evil.com redirects opener to phishing page â†’ steals credentials

HEADER:
  Cross-Origin-Opener-Policy: same-origin
  â”€ "unsafe-none" (default): your page can be referenced cross-origin
  â”€ "same-origin-allow-popups": your page opens popups but isolates from cross-origin
  â”€ "same-origin": COMPLETE isolation â€” no cross-origin opener access (RECOMMENDED)

IMPLEMENTATION:
  Cross-Opener-Policy: same-origin; report-to="endpoint"
```

```nginx
# Nginx â€” add COOP and COEP headers
add_header Cross-Origin-Opener-Policy "same-origin" always;
add_header Cross-Origin-Embedder-Policy "require-corp" always;
```

```
âš ï¸ COEP "require-corp" requires all cross-origin resources to explicitly
   opt-in via CORP header or CORS. This can break CDN-loaded resources.
   For most apps: start with COEP "credentialless" (Chrome 98+).
```

#### Cross-Origin Embedder Policy (COEP)

```
WHAT IT PREVENTS:
  Prevents your page from loading cross-origin resources that don't explicitly
  grant permission. This is a prerequisite for:
    - SharedArrayBuffer (needed for some performance features)
    - High-resolution timers (Spectre mitigation)
    - Full site isolation

HEADER:
  Cross-Origin-Embedder-Policy: require-corp
  â”€ All cross-origin resources must send CORP or CORS headers
  â”€ Breaks images from CDNs without CORP header

  Alternative (Chrome 98+):
  Cross-Origin-Embedder-Policy: credentialless
  â”€ Cross-origin resources are loaded without credentials
  â”€ Less strict, compatible with most CDNs
  â”€ RECOMMENDED for most applications
```

#### Cross-Origin Resource Policy (CORP)

```
WHAT IT PREVENTS:
  Stops other websites from including your resources when they shouldn't.
  Attack scenario:
    - evil.com includes <script src="https://your-app.com/api/clients">
    - Browser includes cookies, but CORS blocks reading response
    - However, if response has valid JavaScript, evil.com can detect side effects

HEADER:
  Cross-Origin-Resource-Policy: same-origin
  â”€ "same-origin": only your origin can load this resource (RECOMMENDED for APIs)
  â”€ "same-site": your site + subdomains can load
  â”€ "cross-origin": anyone can load (default)

  Implementation per endpoint:
    API responses:  CORP: same-origin
    Public assets:  CORP: cross-origin (or omit)
    CDN resources:  CORP: cross-origin
```

#### Fetch Metadata (Sec-Fetch-* Headers)

```
WHAT IT PREVENTS:
  Browsers now send Fetch Metadata headers with every request:
    â”€ Sec-Fetch-Site:     cross-site | same-site | same-origin | none
    â”€ Sec-Fetch-Mode:     navigate | same-origin | no-cors | cors | websocket
    â”€ Sec-Fetch-Dest:     document | style | script | image | empty | ...
    â”€ Sec-Fetch-User:     ?1 (present for user-initiated navigations)

  Your server can use these headers to distinguish:
    â”€ A real user clicking a link vs. an <img> tag initiated request
    â”€ Cross-site requests vs. same-origin API calls
    â”€ Navigations vs. subresource loads

IMPLEMENTATION â€” middleware to validate:
```

```php
// Laravel â€” middleware to validate Sec-Fetch-* headers
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ValidateFetchMetadata
{
    public function handle(Request $request, Closure $next)
    {
        // Skip for non-web requests
        if ($request->expectsJson()) {
            $fetchSite = $request->header('Sec-Fetch-Site');
            $fetchMode = $request->header('Sec-Fetch-Mode');
            $fetchDest = $request->header('Sec-Fetch-Dest');

            // Deny cross-site navigation requests to API (should always be same-origin)
            if ($fetchSite === 'cross-site' && $fetchDest === '') {
                return response()->json(['error' => 'Forbidden'], 403);
            }

            // API endpoints should only be called as same-origin or cors requests
            if ($fetchSite === 'cross-site' && $fetchMode !== 'cors') {
                return response()->json(['error' => 'Forbidden'], 403);
            }
        }

        return $next($request);
    }
}
```

```js
// Node â€” Fetch Metadata validation middleware
const fetchMetadataGuard = (req, res, next) => {
  const fetchSite = req.headers['sec-fetch-site'];
  const fetchMode = req.headers['sec-fetch-mode'];

  // Block cross-site form POSTs (CSRF protection at browser level)
  if (fetchSite === 'cross-site' && req.method !== 'GET') {
    // Still allow if they have CSRF token (legitimate)
    // But block if no CSRF token or invalid
    const csrfToken = req.headers['x-csrf-token'];
    if (!csrfToken || csrfToken !== req.session.csrfToken) {
      return res.status(403).json({ error: 'Cross-site blocked' });
    }
  }

  // API endpoints must not be navigated to directly in browser
  if (fetchMode === 'navigate' && req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }

  next();
};

app.use('/api', fetchMetadataGuard);
```

```nginx
# Nginx â€” block cross-site requests to sensitive endpoints
# (Using Sec-Fetch-Site header)
location /api/admin/ {
    if ($http_sec_fetch_site ~* "cross-site") {
        return 403;
    }
}
```

#### Trusted Types

```
WHAT IT PREVENTS:
  Trusted Types eliminates DOM XSS by requiring that HTML injection points
  (innerHTML, outerHTML, insertAdjacentHTML, document.write, etc.) only
  receive trusted, sanitized values.

HOW IT WORKS:
  1. You set CSP: require-trusted-types-for 'script'
  2. Browser blocks ALL string assignments to dangerous sinks
  3. You must create a Trusted Type policy that sanitizes input
  4. Policy violations are reported (not blocked) during transition

HEADER:
  Content-Security-Policy: require-trusted-types-for 'script'; report-uri /csp-report
```

```js
// Create a Trusted Types policy
if (window.trustedTypes && trustedTypes.createPolicy) {
  const sanitizePolicy = trustedTypes.createPolicy('sanitize', {
    createHTML: (input) => {
      // Use DOMPurify to sanitize
      return DOMPurify.sanitize(input, {
        ALLOWED_TAGS: ['p', 'b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href', 'target'],
      });
    },
    createScriptURL: (url) => {
      // Only allow same-origin scripts
      if (url.startsWith('/')) return url;
      throw new Error(`Blocked script URL: ${url}`);
    },
  });

  // Usage
  element.innerHTML = sanitizePolicy.createHTML(userInput);
}

// Without Trusted Types, this would work (and be dangerous):
// element.innerHTML = userInput; // â† BLOCKED by Trusted Types + CSP
```

#### Subresource Integrity (SRI)

```html
<!-- SRI ensures CDN-loaded files haven't been tampered with -->
<script
  src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"
  integrity="sha384-OgVRvuATP1z7JjHLkuOU7Xw704+h835Lr+6QL9UvYjZE3Ipu6Tp75j7Bh/kR0JKI"
  crossorigin="anonymous"
></script>

<!-- Generate SRI hash: -->
<!-- openssl dgst -sha384 -binary file.js | openssl base64 -A -->
<!-- Or: npx sri-toolbox --hashes sha384 file.js -->

<!-- For Nuxt (auto-generated during build) -->
<!-- Nuxt generates SRI automatically when experimental: { integrity: true } -->
```

```ts
// nuxt.config.ts â€” enable SRI
export default defineNuxtConfig({
  experimental: {
    integrity: true, // Auto-adds SRI to all script/link tags
  },
});
```

#### Permissions Policy (Formerly Feature Policy)

```
WHAT IT PREVENTS:
  Restricts which browser APIs your page and embedded iframes can use.
  Even if XSS succeeds, attacker can't access sensitive APIs.

HEADER:
  Permissions-Policy: camera=(), microphone=(), geolocation=(self), payment=(self),
                      usb=(), accelerometer=(), gyroscope=(), magnetometer=(),
                      midi=(), sync-xhr=(), fullscreen=(self)

  â”€ ()            : Disabled entirely (RECOMMENDED for most)
  â”€ (self)        : Allowed for same-origin only
  â”€ *             : Allowed for all origins (avoid)
  â”€ (src "cdn.com"): Allowed for specific origins

RECOMMENDED FOR AGENCY CRM:
  camera=()
  microphone=()
  geolocation=(self)        # Optional: for client location in projects
  payment=(self)            # Stripe needs this
  usb=()
  accelerometer=()
  gyroscope=()
  magnetometer=()
  midi=()
  sync-xhr=()               # Block synchronous XHR (legacy, bad UX)
  fullscreen=(self)
  display-capture=()        # Block screen capture
  document-domain=()        # Block document.domain setting
```

#### Browser Security Checklist

```
  â”€ Cross-Origin-Opener-Policy: same-origin
  â”€ Cross-Origin-Embedder-Policy: credentialless (or require-corp)
  â”€ Cross-Origin-Resource-Policy: same-origin on API responses
  â”€ Sec-Fetch-* headers validated server-side for sensitive endpoints
  â”€ Trusted Types policy implemented (if feasible)
  â”€ Subresource Integrity (SRI) on all CDN-loaded scripts/styles
  â”€ Permissions Policy restrictively configured
  â”€ Credential Management API restricted (prevent credential leaking)
  â”€ Document Policy: document-write=?0, force-load-at-top=?0
  â”€ Fetch Metadata middleware enforced on API routes
  â”€ Nginx/Apache filters for cross-site requests to admin endpoints
```

---

### 10.25 OAuth2 / Social Login / SSO Security

#### OAuth2 Threat Model

```
OAuth2 enables third-party login (Google, GitHub, Facebook) via Supabase Auth.

ATTACK VECTORS:
  1. CSRF via state parameter â€” no state â†’ attacker initiates login, intercepts callback
  2. Authorization code interception â€” attacker steals code via referrer or open redirect
  3. Authorization code injection â€” attacker injects stolen code into victim's session
  4. Token leakage â€” tokens exposed in URL parameters (fragment is safer)
  5. Redirect URI manipulation â€” attacker changes redirect_uri to their domain
  6. Client secret exposure â€” secret leaked in source code or logs
  7. Consent phishing â€” fake OAuth consent screen tricks user
  8. Account takeover via email â€” if OAuth email matches existing account
```

#### State Parameter (CSRF Protection)

```php
// Laravel â€” OAuth state parameter (Socialite)
use Laravel\Socialite\Facades\Socialite;

// 1. Generate state before redirect
public function redirectToProvider()
{
    $state = Str::random(40);
    Session::put('oauth_state', $state);

    return Socialite::driver('google')
        ->with(['state' => $state])
        ->redirect();
}

// 2. Validate state on callback
public function handleProviderCallback()
{
    $state = request()->input('state');
    $savedState = Session::pull('oauth_state');

    if (!$state || !$savedState || !hash_equals($savedState, $state)) {
        // CSRF attack detected â€” abort
        abort(401, 'Invalid OAuth state');
    }

    $user = Socialite::driver('google')->user();
    // ...
}
```

```js
// Node â€” OAuth state parameter (Passport.js)
const crypto = require('crypto');

// Authorization redirect
app.get('/auth/google', (req, res) => {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.oauthState = state;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: 'https://api.amin670bd.com/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    state: state,
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Callback
app.get('/auth/google/callback', async (req, res) => {
  const { code, state } = req.query;

  // Validate state (prevent CSRF)
  if (!state || state !== req.session.oauthState) {
    logger.warn('OAuth state mismatch', { ip: req.ip });
    return res.status(401).json({ error: 'Invalid state parameter' });
  }
  delete req.session.oauthState;

  // Exchange code for token
  const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uri: 'https://api.amin670bd.com/auth/google/callback',
    grant_type: 'authorization_code',
  });

  // Verify ID token
  const decoded = jwt.verify(tokenResponse.data.id_token, jwksClient);
  // ...
});
```

#### PKCE (Proof Key for Code Exchange)

```
PKCE is REQUIRED for public clients (SPA, mobile apps) that cannot securely
store a client secret. Supabase uses PKCE by default.

FLOW:
  1. Client generates code_verifier (random 43-128 chars)
  2. Client generates code_challenge = SHA256(code_verifier)
  3. Authorization request includes code_challenge
  4. Token exchange includes code_verifier
  5. Server verifies SHA256(code_verifier) == code_challenge
  6. Even if authorization code is intercepted, attacker needs code_verifier
```

```js
// PKCE generation (browser or server)
const generatePKCE = async () => {
  const verifier = crypto.randomBytes(64)
    .toString('base64url');

  const challenge = crypto.createHash('sha256')
    .update(verifier)
    .digest('base64url');

  return { verifier, challenge };
};

// Store verifier in session for callback
const { verifier, challenge } = await generatePKCE();
req.session.pkceVerifier = verifier;

// Authorization URL with PKCE
const authUrl = `https://api.supabase.com/auth/v1/authorize` +
  `?client_id=${SUPABASE_CLIENT_ID}` +
  `&redirect_uri=${CALLBACK_URL}` +
  `&response_type=code` +
  `&code_challenge=${challenge}` +
  `&code_challenge_method=S256`;

res.redirect(authUrl);

// In callback:
const tokenResponse = await axios.post('https://api.supabase.com/auth/v1/token', {
  grant_type: 'authorization_code',
  code: req.query.code,
  redirect_uri: CALLBACK_URL,
  code_verifier: req.session.pkceVerifier, // â† Prove you made the original request
});
```

#### Redirect URI Validation

```php
// Laravel â€” strict redirect URI validation
public function handleProviderCallback(string $provider)
{
    // Socialite validates redirect_uri automatically
    // But for custom OAuth: enforce strict check

    $allowedRedirects = [
        'https://amin670bd.com/auth/callback',
        'https://www.amin670bd.com/auth/callback',
        'https://dashboard.amin670bd.com/auth/callback',
        'http://localhost:3000/auth/callback',  // Dev only
        'http://localhost:5173/auth/callback',  // Vite dev
    ];

    $redirectUri = request()->input('redirect_uri');
    if (!in_array($redirectUri, $allowedRedirects)) {
        abort(400, 'Invalid redirect URI');
    }

    // Also validate via exact match (not just prefix)
    // âŒ https://evil.com/https://amin670bd.com/auth/callback â† path traversal
    // âœ… URL must match EXACTLY
}
```

```js
// Node â€” redirect URI validation
const validateRedirectUri = (uri) => {
  const allowed = [
    'https://amin670bd.com/auth/callback',
    'https://dashboard.amin670bd.com/auth/callback',
  ];

  try {
    const parsed = new URL(uri);

    // Exact match (no path traversal)
    if (!allowed.includes(uri)) {
      return false;
    }

    // Block URIs with fragments (can hide redirect target)
    if (parsed.hash) {
      return false;
    }

    // Block URIs with authentication
    if (parsed.username || parsed.password) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};
```

#### Supabase OAuth Specific

```ts
// Nuxt + Supabase â€” secure OAuth configuration

// nuxt.config.ts
export default defineNuxtConfig({
  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      includeDefaultRedirect: false,
    },
    // Cookie-based auth (recommended over localStorage)
    cookieName: 'sb-auth-token',
    cookieOptions: {
      secure: true,
      sameSite: 'lax', // Must be Lax for OAuth redirect flow
      path: '/',
    },
  },
});

// Login component
const signInWithOAuth = async (provider: 'google' | 'github' | 'facebook') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      // Supabase handles PKCE automatically
      // Supabase validates state automatically
    },
  });
};

// Callback page (auth/callback.vue)
const handleCallback = async () => {
  const { data, error } = await supabase.auth.exchangeCodeForSession(
    route.query.code
  );
  // Supabase validates code_verifier + state automatically
};
```

#### OAuth Account Linking

```sql
-- Supabase â€” prevent account takeover via email matching
-- When a user signs in with OAuth, Supabase looks up existing user by email.
-- If found, it links the identity (safe).
-- If you want to prevent automatic linking:

-- 1. Create a trigger to block OAuth signup if email exists
CREATE OR REPLACE FUNCTION handle_oauth_login()
RETURNS TRIGGER AS $$
BEGIN
  -- If user exists with this email but no OAuth identity for this provider
  IF EXISTS (
    SELECT 1 FROM auth.users
    WHERE email = NEW.email
    AND id NOT IN (
      SELECT user_id FROM auth.identities
      WHERE provider = NEW.raw_app_meta_data->>'provider'
    )
  ) THEN
    RAISE EXCEPTION 'Email already registered with a different provider. Link accounts manually.';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_oauth_signup
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.raw_app_meta_data->>'provider' IS NOT NULL)
  EXECUTE FUNCTION handle_oauth_login();
```

#### OAuth2 Security Checklist

```
  â”€ State parameter cryptographically random (min 128 bits)
  â”€ State validated on callback using constant-time comparison (hash_equals)
  â”€ PKCE enforced for all public clients (SPA, mobile)
  â”€ Redirect URI validated by EXACT match (not prefix match)
  â”€ No wildcard redirect URIs (https://*.yourdomain.com)
  â”€ Client secret NEVER exposed to browser
  â”€ Authorization code exchanged for token server-side (not client)
  â”€ ID token validated: signature, issuer, audience, expiry
  â”€ Token stored in httpOnly cookie (not localStorage)
  â”€ Account linking decisions logged (audit trail)
  â”€ Rate limiting on OAuth endpoints (prevent brute force)
  â”€ OAuth state timeout: expire after 5 minutes
  â”€ Social login email verified (Supabase handles this)
  â”€ Supabase: cookie-based auth preferred over localStorage
```

---

### 10.26 Secrets Management

#### The Problem

```
DEVELOPMENT:                                      PRODUCTION:
  â”€ .env file with 20+ secrets                      â”€ Environment variables in Vercel
  â”€ Hardcoded API keys for testing                   â”€ Secrets in GitHub Actions
  â”€ Secrets shared via Slack/WhatsApp                â”€ Database passwords in config files
  â”€ Old secrets in git history                       â”€ Third-party API tokens in logs
  â”€ Copied .env to wrong project                    â”€ Service role keys exposed to devs

ALL OF THESE ARE DATA BREACHES WAITING TO HAPPEN.
```

#### Secrets Management Tiers

```
TIER 0: .env file + .env.example (small solo project)
  â”€ .env in .gitignore (REQUIRED)
  â”€ .env.example with placeholder values
  â”€ No secrets committed to git EVER
  â”€ PRO: Simple, works
  â”€ CON: No rotation, no audit, easy to accidentally share

TIER 1: Platform environment variables (Vercel, Netlify, Supabase)
  â”€ All secrets in platform dashboard
  â”€ Environment-specific (dev/staging/prod)
  â”€ PRO: Auditable, no local files in prod
  â”€ CON: Hard to manage many secrets, no API for rotation

TIER 2: Dedicated secrets manager (Doppler, Infisical, 1Password CLI)
  â”€ Single source of truth for all environments
  â”€ API-driven, CLI, CI/CD integration
  â”€ Automatic rotation
  â”€ Audit logging
  â”€ PRO: Professional, scalable
  â”€ CON: Learning curve, another service
  â”€ RECOMMENDED for agency CRM

TIER 3: Enterprise (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault)
  â”€ Dynamic secrets (ephemeral DB credentials)
  â”€ Fine-grained access control
  â”€ Encryption as a service
  â”€ PRO: Enterprise-grade
  â”€ CON: Overkill for solo agency
```

#### Doppler / Infisical Setup (Recommended Tier 2)

```bash
# Doppler (SaaS, generous free tier)
# 1. Install CLI
npm install -g @doppler/cli

# 2. Login
doppler login

# 3. Setup project
doppler setup

# 4. Add secrets
doppler secrets set SUPABASE_URL=https://project.supabase.co
doppler secrets set SUPABASE_ANON_KEY=eyJ...
doppler secrets set SUPABASE_SERVICE_KEY=eyJ...
doppler secrets set STRIPE_SECRET_KEY=sk_live_...
doppler secrets set RESEND_API_KEY=re_...
doppler secrets set JWT_SECRET=$(openssl rand -base64 64)

# 5. Download .env for local dev
doppler secrets download --format env > .env

# 6. Run app with secrets injected
doppler run -- npm run dev
```

```yaml
# GitHub Actions â€” use Doppler for CI/CD
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Doppler CLI
        uses: dopplerhq/cli-action@v2

      - name: Build with secrets
        run: doppler run -- npm run build
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}

      - name: Deploy to Vercel
        run: doppler run -- npx vercel --prod
        env:
          DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
```

#### Secret Rotation Policy

```
SECRET                      ROTATION            METHOD
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
JWT signing key             30 days             Generate new, keep both active for overlap
Supabase anon key           90 days             Supabase dashboard (no downtime)
Supabase service key        90 days             Supabase dashboard
Stripe secret key           90 days             Stripe dashboard â€” roll immediately
Stripe webhook secret       On change           Stripe dashboard
Resend API key              90 days             Resend dashboard
Database password           180 days            Supabase dashboard
OAuth client secret         90 days             Provider dashboard (GitHub, Google)
GitHub personal access      30 days             GitHub settings
SSH keys                    180 days            Generate new, deploy, remove old
Cloudflare API token        90 days             Cloudflare dashboard

IMPORTANT: Rotation should have overlap period where both old and new work.
           Test new secret before revoking old one.
```

#### Secret Detection in Code

```bash
# Prevent secret commits with pre-commit hooks

# 1. Use git-secrets
# Install: https://github.com/awslabs/git-secrets
git secrets --install
git secrets --register-aws  # Adds AWS patterns
# Add custom patterns:
git secrets --add 'sk_live_[0-9a-zA-Z]+'      # Stripe live key
git secrets --add 'sk_test_[0-9a-zA-Z]+'      # Stripe test key
git secrets --add 're_[a-zA-Z0-9]+'           # Resend key
git secrets --add 'ghp_[0-9a-zA-Z]+'          # GitHub token
git secrets --add 'gho_[0-9a-zA-Z]+'          # GitHub OAuth
git secrets --add 'ghs_[0-9a-zA-Z]+'          # GitHub SSH token

# 2. Use Gitleaks (GitHub Action + CLI)
# .github/workflows/secret-scan.yml
- name: Gitleaks
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# 3. TruffleHog (alternative)
# npx trufflehog git file://. --only-verified

# 4. Scan git history for existing secrets (first time):
git secrets --scan-history
```

#### .env File Security

```
RULES FOR .env FILES:
  â”€ .env NEVER committed to git (.gitignore it)
  â”€ .env.example committed with PLACEHOLDER values only
  â”€ .env.local for local overrides (also gitignored)
  â”€ .env.production only exists on server, never locally
  â”€ .env files have 600 permissions (owner read/write only)
  â”€ .env files stored outside webroot (for VPS: /var/www/agency/.env)
  â”€ Never paste .env content in Slack, Discord, or any chat
  â”€ Never screenshot .env content
  â”€ Use 'doppler download' or 'vercel env pull' to get .env, don't copy manually

EXAMPLE .env.example:
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your_anon_key_here
  SUPABASE_SERVICE_KEY=your_service_key_here
  STRIPE_SECRET_KEY=sk_live_your_key_here
  STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
  RESEND_API_KEY=re_your_key_here
  NUXT_PUBLIC_SITE_URL=https://amin670bd.com
  JWT_SECRET=your_jwt_secret_here
```

#### Secrets Management Checklist

```
  â”€ .env in .gitignore (verified no commits contain secrets)
  â”€ .env.example has ONLY placeholder values
  â”€ No hardcoded secrets in source code
  â”€ No secrets in client-side JavaScript
  â”€ Pre-commit hook (gitleaks or git-secrets) installed
  â”€ Git history scanned for existing secrets
  â”€ Secrets manager used for production (Doppler/Infisical)
  â”€ CI/CD uses injected secrets (not hardcoded)
  â”€ Secret rotation schedule documented and followed
  â”€ Service role keys NEVER used from client-side code
  â”€ API keys scoped to minimum permissions
  â”€ Incident response: revoke secrets immediately on breach
  â”€ Periodic audit: list all active secrets, verify necessity
```

---

### 10.27 DNS Security

#### Why DNS Security Matters

```
DNS is the foundation of your web presence. Attackers target DNS to:
  â”€ Hijack your domain (change nameservers â†’ serve phishing pages)
  â”€ Poison DNS cache (redirect traffic to malicious servers)
  â”€ Subdomain takeover (register deleted DNS entries pointing to cloud services)
  â”€ DNS tunneling (exfiltrate data via DNS queries)
  â”€ Typosquatting (register similar domains to catch mistyped traffic)

IMPACT ON AGENCY CRM:
  â”€ Client portal hijacked â†’ client data stolen
  â”€ Email hijacked â†’ password reset intercepts
  â”€ Subdomain takeover â†’ XSS on trusted subdomain â†’ full account compromise
  â”€ Domain locked by registrar â†’ business interruption
```

#### DNSSEC â€” DNS Security Extensions

```dns
; DNSSEC cryptographically signs DNS records
; Prevents DNS spoofing / cache poisoning

; ENABLE THROUGH YOUR DNS PROVIDER:
;   Cloudflare:       Dashboard â†’ DNS â†’ DNSSEC â†’ Enable
;   Namecheap:        Dashboard â†’ Domain â†’ DNSSEC â†’ Enable
;   Google Domains:   Dashboard â†’ DNS â†’ DNSSEC â†’ Enable
;   AWS Route53:      Hosted zone â†’ Enable DNSSEC signing

; CHECK IF YOUR DOMAIN HAS DNSSEC:
dig amin670bd.com DNSKEY +short
; If it returns DNSKEY records â†’ DNSSEC is enabled

; VERIFY DNSSEC CHAIN:
delv amin670bd.com SOA
; Should return: fully validated
```

#### Domain Hijacking Prevention

```
REGISTRAR LOCK (TRANSFER LOCK):
  â”€ REQUIRED: Enable registrar lock (transfer lock) on your domain
  â”€ This prevents unauthorized transfer to another registrar
  â”€ Must unlock via registrar dashboard to transfer (you get email notification)

REGISTRAR SECURITY:
  â”€ Use a reputable registrar (Cloudflare, Namecheap, Google Domains, AWS Route53)
  â”€ Enable 2FA on your registrar account (MANDATORY)
  â”€ Use a STRONG, unique password (password manager generated)
  â”€ Disable automatic domain transfer approval
  â”€ Use registrar-locked status at registry level

CONTACT INFORMATION:
  â”€ Use WHOIS privacy (free on most registrars)
  â”€ Use a dedicated email for registrar contact (not your personal email)
  â”€ Keep your registrant email up-to-date (critical for transfer notifications)

DNSSEC:
  â”€ Enable DNSSEC at your registrar (signs your DNS records)
  â”€ DS records automatically published to parent zone
```

#### Subdomain Takeover Prevention

```
WHAT IS SUBDOMAIN TAKEOVER?
  You create a CNAME DNS record pointing to:
    dashboard.amin670bd.com â†’ agency-dashboard.vercel.app
  Later you delete the Vercel project.
  Attacker creates a Vercel project â†’ claims agency-dashboard.vercel.app
  Now attacker controls dashboard.amin670bd.com â†’ full XSS/Phishing capability

DEFENSE:
  1. AUDIT ALL DNS RECORDS: Monthly review of every CNAME, A, AAAA record
  2. REMOVE ORPHANED RECORDS: When deleting a cloud resource, remove DNS first
  3. MONITOR RESOLUTION: Alert if a DNS record returns NXDOMAIN
  4. USE VERIFICATION TOKENS: Some providers let you verify ownership
  5. PREFER A/AAAA RECORDS: Over CNAME when possible (less takeover risk)

MONITORING SCRIPT:
```

```bash
#!/bin/bash
# Check for orphaned DNS records (subdomain takeover)
# Run weekly via cron

DOMAIN="amin670bd.com"
RECORDS=$(dig $DOMAIN CNAME +short)

for record in $RECORDS; do
  # Resolve the CNAME target
  TARGET_IP=$(dig $record +short)

  if [ -z "$TARGET_IP" ]; then
    echo "âš ï¸  ORPHANED CNAME: $record â†’ $record (NXDOMAIN)"
    echo "  â†’ Remove DNS record or redeploy service"
  fi
done
```

```yaml
# GitHub Action to monitor subdomain health
# .github/workflows/subdomain-monitor.yml
name: Subdomain Monitor
on:
  schedule:
    - cron: '0 6 * * 1'  # Every Monday 6 AM

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Check DNS records
        run: |
          for record in "dashboard" "api" "www" "portal" "store" "email"; do
            if ! dig +short $record.amin670bd.com | grep -q .; then
              echo "NXDOMAIN for $record.amin670bd.com"
            fi
          done
```

#### DNS Configurations

```dns
; RECOMMENDED DNS CONFIGURATION FOR AGENCY CRM:

; Core records
amin670bd.com.            A    76.76.21.21     ; Vercel (or your host IP)
www.amin670bd.com.        CNAME  amin670bd.com.
*.amin670bd.com.          CNAME  amin670bd.com. ; Wildcard for app subdomains

; Specific subdomains (overrides wildcard)
dashboard.amin670bd.com.  CNAME  cname.vercel-dns.com.
api.amin670bd.com.         CNAME  cname.vercel-dns.com.
portal.amin670bd.com.      CNAME  cname.vercel-dns.com.
store.amin670bd.com.       CNAME  cname.vercel-dns.com.

; Email records
amin670bd.com.            MX 10  mx.resend.com.   ; Resend email
amin670bd.com.            TXT   "v=spf1 include:_spf.resend.com -all"
_dmarc.amin670bd.com.     TXT   "v=DMARC1; p=reject; rua=mailto:dmarc@amin670bd.com"
resend._domainkey...      TXT   "v=DKIM1; k=rsa; p=..."

; Security
amin670bd.com.            NS    ; Keep your registrar's nameservers (or Cloudflare)

; DNSSEC
; DS record published at registrar level (not in zone)
```

#### DNS Security Checklist

```
  â”€ DNSSEC enabled at registrar
  â”€ Registrar lock (transfer lock) enabled
  â”€ 2FA on registrar account
  â”€ WHOIS privacy enabled
  â”€ Dedicated email for domain contact
  â”€ All DNS records audited monthly (remove orphaned CNAMEs)
  â”€ Subdomain takeover monitoring active (weekly)
  â”€ DNS uses Cloudflare or other reputable DNS provider
  â”€ SPF, DKIM, DMARC records published
  â”€ No unnecessary DNS records exposed
  â”€ TXT records don't leak internal information
  â”€ CAA (Certification Authority Authorization) record published:
    amin670bd.com.  CAA  0 issue "letsencrypt.org"
    amin670bd.com.  CAA  0 issue "comodoca.com"
    amin670bd.com.  CAA  0 iodef "mailto:security@amin670bd.com"
  â”€ DANE/TLSA records considered for HTTPS (advanced, overkill for most)
```

---

### 10.28 CI/CD Pipeline Security

#### Pipeline Threat Model

```
CI/CD pipelines have expansive permissions â€” making them prime targets:

THREATS:
  1. Compromised GitHub token â†’ attacker can push to main, modify CI, deploy malicious code
  2. Secrets leaked in build logs â†’ npm tokens, cloud keys exposed
  3. Dependency confusion during build â†’ attacker package injected
  4. Artifact tampering â†’ binary modified after build but before deploy
  5. Third-party action compromise â†’ action with O(1000) users injects backdoor
  6. Self-hosted runner takeover â†’ attacker executes arbitrary code on runner
  7. PR approval bypass â†’ malicious code merged via social engineering
```

#### GitHub Actions Security

```yaml
# SECURE GITHUB ACTIONS CONFIGURATION
# .github/workflows/deploy.yml

name: Secure CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

# PIN ACTIONS TO FULL COMMIT SHA (never tags)
# Instead of: uses: actions/checkout@v4
# Use:      uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683

jobs:
  security-checks:
    runs-on: ubuntu-latest
    # Use minimal permissions per job (principle of least privilege)
    permissions:
      contents: read
      security-events: write
      pull-requests: read

    steps:
      # Pin to commit SHA
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
        with:
          # Limit fetch depth (faster + less history exposed)
          fetch-depth: 0

      - name: Secret scanning
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: npm audit
        run: npm audit --audit-level=high

  build-and-deploy:
    needs: security-checks
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
      id-token: write  # For OIDC (no long-lived secrets)

    environment: production  # Require approval for production deploy

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683

      - name: Setup Node
        uses: actions/setup-node@1d0ff469b7ec7b3cb9d8673fde0c81c44821de2a
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      - name: Build
        run: npm run build
        env:
          # Secrets injected at build time, not in code
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
          # ... other secrets

      # Sign the build artifact
      - name: Generate SBOM
        run: npx @cyclonedx/cyclonedx-npm --output-file dist/sbom.json

      - name: Deploy to Vercel
        run: npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
        # âš ï¸ Prefer OIDC over long-lived tokens:
        # uses: amondnet/vercel-action@v20
```

#### Environment Protection

```yaml
# GitHub â†’ Settings â†’ Environments â†’ production
# Configure:
#   Required reviewers: 1 (you, for solo agency)
#   Wait timer: 0 minutes
#   Deployment branches: main
#   Protection rules:
#     - Prevent self-review (if you had multiple accounts)

# This prevents ANY deployment to production without explicit approval,
# even if CI is compromised.
```

#### OIDC â€” No Long-Lived Secrets

```yaml
# Better than storing VERCEL_TOKEN as a secret â€” use OIDC
# GitHub Actions can request a short-lived token from your cloud provider

name: Deploy with OIDC
on:
  push:
    branches: [main]

permissions:
  id-token: write  # Request OIDC token
  contents: read

jobs:
  deploy:
    environment: production
    steps:
      - uses: actions/checkout@v4

      # Vercel OIDC (requires Vercel OIDC integration)
      - name: Deploy
        run: npx vercel --prod
        env:
          VERCEL_ORG_ID: ${{ vars.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ vars.VERCEL_PROJECT_ID }}
        # No VERCEL_TOKEN needed â€” OIDC handles auth
```

#### Build Artifact Integrity

```bash
# Ensure what you built is what gets deployed

# 1. Sign artifacts with cosign
cosign sign-blob --key cosign.key dist/agency-app.tar.gz > dist/agency-app.tar.gz.sig

# 2. Generate checksums
cd dist && sha256sum * > checksums.txt

# 3. Verify on deploy
sha256sum -c checksums.txt
cosign verify-blob --key cosign.pub --signature dist/agency-app.tar.gz.sig dist/agency-app.tar.gz

# 4. Git tag releases with signed tags
git tag -s v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3
```

#### CI/CD Security Checklist

```
  â”€ All GitHub Actions pinned to full commit SHA (never tags/major versions)
  â”€ Minimal permissions per job (contents: read, never write unless needed)
  â”€ No secrets printed in build logs (use ::add-mask:: for sensitive values)
  â”€ Environment protection rules: require approval for production
  â”€ Secrets never in code or PR comments
  â”€ npm audit runs in CI (blocks critical/high)
  â”€ Secret scanning (gitleaks/trufflehog) in CI
  â”€ SBOM generated and attached to each release
  â”€ Build artifacts signed (cosign or GPG)
  â”€ OIDC preferred over long-lived tokens
  â”€ Least privilege on npm tokens (read-only for install, publish tokens separate)
  â”€ Branch protection on main: require PR, require status checks
  â”€ No self-hosted runners (use GitHub-hosted â€” more secure)
  â”€ Review third-party actions before adding (check source code + reputation)
  â”€ Container images scanned before push (Trivy/Docker Scout)
```

---

### 10.29 Cryptography Best Practices

#### Choosing the Right Algorithm

```
USE THESE (current as of 2026):
  â”€ Symmetric encryption: AES-256-GCM (authenticated encryption)
  â”€ Asymmetric encryption: X25519 (ECDH for key agreement)
  â”€ Digital signatures: Ed25519 or ECDSA with P-256
  â”€ Hash functions: SHA-256 or SHA-3 (SHA-1 is broken, MD5 is broken)
  â”€ Key derivation: Argon2id (for passwords), HKDF (for key expansion)
  â”€ Password hashing: bcrypt (cost 12+), Argon2id (RECOMMENDED)
  â”€ Random generation: crypto.randomBytes() / random_bytes() (CSPRNG)
  â”€ HMAC: HMAC-SHA256 or HMAC-SHA512

NEVER USE:
  âŒ MD5 (collision attacks since 2004)
  âŒ SHA-1 (SHAttered collision attack, 2017)
  âŒ DES / 3DES (brute-forced in hours)
  âŒ RC4 (biased output, completely broken)
  âŒ ECB mode (patterns visible in ciphertext)
  âŒ RSA with < 2048 bits (factorable with modern hardware)
  âŒ Dual_EC_DRBG (backdoored by NSA)
  âŒ Pseudo-random generators: Math.random(), rand()
```

#### Key Generation

```bash
# Generate cryptographically secure keys

# 256-bit random key (symmetric encryption / HMAC)
openssl rand -base64 32
# Example: x9kLm4NpQrStUvWxYzAbCdEfGhIjKlMnOpQrStUvWxY=

# 512-bit key (for HS512 JWT)
openssl rand -base64 64

# RSA 4096-bit private key
openssl genpkey -algorithm RSA -pkeyopt rsa_keygen_bits:4096 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem

# Ed25519 key pair (RECOMMENDED for signatures)
openssl genpkey -algorithm ED25519 -out private.pem
openssl pkey -in private.pem -pubout -out public.pem

# X25519 key pair (RECOMMENDED for key exchange)
openssl genpkey -algorithm X25519 -out private.pem

# Application secret (for sessions, CSRF, etc.)
# MUST be 64+ bytes
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

#### Encryption at Rest

```sql
-- PostgreSQL â€” column-level encryption with pgcrypto
-- For sensitive data that MUST be encrypted even from DB admin

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Encrypt sensitive notes
INSERT INTO client_notes (client_id, encrypted_note)
VALUES (
  'client-uuid',
  pgp_sym_encrypt(
    'This is sensitive client information',
    current_setting('app.encryption_key')
  )
);

-- Decrypt (application-level, not in view)
SELECT pgp_sym_decrypt(
  encrypted_note,
  current_setting('app.encryption_key')
) AS note
FROM client_notes
WHERE client_id = 'client-uuid';

-- Key management:
--   1. Encryption key stored in secrets manager (not database)
--   2. Rotation: re-encrypt all data with new key
--   3. Key is NEVER logged, NEVER in source code
```

```php
// Laravel â€” built-in encryption (AES-256-CBC or AES-256-GCM)
use Illuminate\Support\Facades\Crypt;

// Encrypt
$encrypted = Crypt::encryptString($sensitiveData);
// Stores: eyJpdiI6ImV5SjBlWEFpT...

// Decrypt
$decrypted = Crypt::decryptString($encrypted);

// Key is stored in config/app.php 'key' (from APP_KEY env)
// APP_KEY must be 32-byte hex string
```

```js
// Node â€” AES-256-GCM encryption
const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = crypto.scryptSync(process.env.ENCRYPTION_KEY, 'salt', 32);

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag().toString('hex');

  // Store all three components
  return JSON.stringify({ iv: iv.toString('hex'), encrypted, authTag });
}

function decrypt(data) {
  const { iv, encrypted, authTag } = JSON.parse(data);

  const decipher = crypto.createDecipheriv(
    ALGORITHM, KEY, Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

#### Random Number Generation

```php
// PHP â€” always use CSPRNG
// âœ… Safe
$token = bin2hex(random_bytes(32)); // 64 char hex string
$csrf = bin2hex(random_bytes(32));

// âŒ Unsafe
$token = uniqid(); // Predictable
$token = md5(time()); // Predictable
$token = rand(); // Not cryptographically secure
```

```js
// Node â€” always use CSPRNG
const crypto = require('crypto');

// âœ… Safe â€” 256-bit random token
const token = crypto.randomBytes(32).toString('hex');

// âœ… Safe â€” for passwords/API keys
const apiKey = crypto.randomBytes(32).toString('base64url');

// âŒ Unsafe
const token = Math.random().toString(36); // â† Only ~50 bits of entropy
const token = Date.now().toString(36) + Math.random(); // â† Predictable
```

#### TLS Configuration

```nginx
# Nginx â€” modern TLS configuration (as of 2026)
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;

    # Certificates
    ssl_certificate     /etc/letsencrypt/live/amin670bd.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/amin670bd.com/privkey.pem;

    # TLS versions â€” only 1.3 (disable 1.2 for maximum security)
    ssl_protocols TLSv1.3;

    # Ciphers (TLS 1.3 ciphers only)
    ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256';

    # Other settings
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1h;
    ssl_session_tickets off;  # Disable session tickets (PFS concern)

    # HSTS
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    # OCSP Stapling
    ssl_stapling on;
    ssl_stapling_verify on;
    resolver 1.1.1.1 8.8.8.8 valid=300s;
    resolver_timeout 5s;
}

# Redirect HTTP â†’ HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name amin670bd.com www.amin670bd.com;
    return 301 https://$host$request_uri;
}
```

#### Cryptography Checklist

```
  â”€ AES-256-GCM used for symmetric encryption (not CBC, not ECB)
  â”€ X25519 or Ed25519 for asymmetric operations (not RSA 1024)
  â”€ Passwords hashed with bcrypt (cost 12+) or Argon2id
  â”€ All random values from CSPRNG (crypto.randomBytes, random_bytes)
  â”€ TLS 1.3 only (TLS 1.2 disabled)
  â”€ Strong ciphers only (AES-256-GCM, CHACHA20-POLY1305)
  â”€ HSTS preload (max-age >= 2 years)
  â”€ OCSP Stapling enabled
  â”€ Session tickets disabled
  â”€ Perfect Forward Secrecy (PFS) via ECDHE key exchange
  â”€ Keys: RSA 4096-bit minimum or Ed25519
  â”€ Encryption key stored in secrets manager, rotated every 90 days
  â”€ No deprecated algorithms in use (MD5, SHA-1, RC4, DES, 3DES)
```

---

### 10.30 Security Automation, Testing & Auditing

#### Security Testing Types

```
SAST  â€” Static Application Security Testing (white-box, source code analysis)
DAST  â€” Dynamic Application Security Testing (black-box, running app)
SCA   â€” Software Composition Analysis (dependency vulnerabilities)
IAST  â€” Interactive Application Security Testing (agent in running app)
Fuzzing â€” Automated input generation to find crashes/errors
Secret Scanning â€” Find secrets in code/repos
Container Scanning â€” Find vulnerabilities in images
```

#### SAST Tools (Free)

```bash
# 1. ESLint with security plugins (JavaScript/TypeScript)
#    npm install -D eslint-plugin-security eslint-plugin-no-secrets

# .eslintrc.js
module.exports = {
  plugins: ['security', 'no-secrets'],
  extends: ['plugin:security/recommended'],
  rules: {
    'no-secrets/no-secrets': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'warn',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'warn',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-object-injection': 'warn',
    'security/detect-new-buffer': 'error',
    'security/detect-pseudoRandomBytes': 'error',
  },
};

# Run in CI
npx eslint . --config .eslintrc.js
```

```bash
# 2. Semgrep (multi-language, free, OSS)
#    Install: pip install semgrep

# Custom rule for detecting dangerous patterns in Nuxt
# semgrep-rules/nuxt-security.yaml
rules:
  - id: no-raw-html
    pattern: v-html="$HTML"
    message: "v-html is dangerous. Use DOMPurify or sanitize input first."
    languages: [vue, javascript]
    severity: ERROR

  - id: no-localstorage-jwt
    patterns:
      - pattern: localStorage.getItem("sb-...")
      - pattern: localStorage.setItem("sb-...")
    message: "Supabase tokens should use cookie storage, not localStorage."
    languages: [javascript, typescript]
    severity: ERROR

  - id: no-unsafe-redirect
    patterns:
      - pattern: navigateTo($INPUT)
      - pattern: $ROUTER.push($INPUT)
    message: "Use safeRedirect() for user-supplied URLs."
    languages: [javascript, typescript]
    severity: WARNING

# Run in CI
semgrep --config semgrep-rules/ --error .
```

```bash
# 3. PHPStan / Psalm (PHP) â€” level max
#    composer require --dev phpstan/phpstan

# phpstan.neon
parameters:
  level: max
  checkMissingIterableValueType: true
  checkGenericClassInNonGenericObjectType: true
  reportUnmatchedIgnoredErrors: true

# Run
vendor/bin/phpstan analyse app/
```

```bash
# 4. .NET Roslyn analyzers
#     dotnet add package Microsoft.CodeAnalysis.NetAnalyzers
#     dotnet add package SecurityCodeScan

# Run
dotnet build --warningsaserrors
```

#### DAST Tools (Free)

```bash
# 1. OWASP ZAP â€” automated security scanner
#    CI integration via GitHub Actions

# .github/workflows/dast.yml
name: DAST Scan
on:
  schedule:
    - cron: '0 6 * * 0'  # Weekly Sunday

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: ZAP Scan
        uses: zaproxy/action-full-scan@v0.9.0
        with:
          target: 'https://staging.amin670bd.com'
          fail_action: true  # Block if high-severity findings

# 2. Nikto (quick web server scan)
nikto -h https://staging.amin670bd.com -ssl -Format json -output nikto-report.json

# 3. Wapiti (web app vulnerability scanner)
wapiti --url https://staging.amin670bd.com --scope folder -f json -o wapiti-report.json
```

#### SCA â€” Software Composition Analysis

```yaml
# Already covered in Supply Chain Security (10.23)
# But add this to CI:
name: SCA Scan
on:
  pull_request:
    paths:
      - 'package.json'
      - 'package-lock.json'

jobs:
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: npm audit
        run: npm audit --audit-level=high

      - name: Snyk Test
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --fail-on=all

      - name: Socket Security (dependency risk detection)
        uses: socketdev/socket-action@master
        with:
          api_key: ${{ secrets.SOCKET_API_KEY }}
```

#### Security Monitoring & Auditing

```js
// Application-level security audit logging
// middleware/auditLogger.js (Node)

const auditLog = (action, entityType, entityId, metadata = {}) => {
  const log = {
    timestamp: new Date().toISOString(),
    actor_id: req.user?.sub || 'anonymous',
    actor_type: req.user?.role || 'public',
    action,
    entity_type: entityType,
    entity_id: entityId,
    metadata: {
      ...metadata,
      ip: req.ip,
      user_agent: req.headers['user-agent'],
      request_id: req.id,
    },
  };

  // Insert into activity_log table
  db.query(
    'INSERT INTO activity_log (actor_id, actor_type, action, entity_type, entity_id, metadata, ip_address, user_agent) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [log.actor_id, log.actor_type, log.action, log.entity_type, log.entity_id, JSON.stringify(log.metadata), log.metadata.ip, log.metadata.user_agent]
  );

  // Also send critical events to monitoring
  if (['failed_login', 'password_change', 'mfa_disabled', 'admin_action', 'payment_failure'].includes(action)) {
    sendAlert(action, log);
  }
};
```

```php
// Laravel â€” audit logging via Spatie Activitylog
// composer require spatie/laravel-activitylog

// Model setup
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class Client extends Model
{
    use LogsActivity;

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logOnly(['name', 'email', 'status', 'total_spent'])
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs();
    }
}

// Log custom events
activity()
    ->causedBy(auth()->user())
    ->performedOn($client)
    ->withProperties(['ip' => request()->ip(), 'user_agent' => request()->userAgent()])
    ->event('client_deleted')
    ->log('Client deleted by admin');

// Retrieve log
$activities = Activity::all();
```

```csharp
// ASP.NET â€” audit logging middleware
public class AuditMiddleware
{
    private readonly RequestDelegate _next;

    public async Task InvokeAsync(HttpContext context, AppDbContext db)
    {
        // Capture request info
        var auditEntry = new AuditLog
        {
            Timestamp = DateTime.UtcNow,
            UserId = context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value,
            IpAddress = context.Connection.RemoteIpAddress?.ToString(),
            UserAgent = context.Request.Headers["User-Agent"].ToString(),
            Method = context.Request.Method,
            Path = context.Request.Path,
        };

        // Hook into response
        context.Response.OnCompleted(async () =>
        {
            auditEntry.StatusCode = context.Response.StatusCode;
            db.AuditLogs.Add(auditEntry);
            await db.SaveChangesAsync();
        });

        await _next(context);
    }
}
```

#### Automated CI Security Pipeline

```yaml
# Full CI security pipeline (.github/workflows/security.yml)
name: Full Security Scan
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Run security checks
  security:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      security-events: write
      actions: read

    steps:
      - uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683
        with:
          fetch-depth: 0

      # 1. Secret scanning
      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

      # 2. SAST â€” CodeQL
      - name: CodeQL Initialization
        uses: github/codeql-action/init@v3
        with:
          languages: javascript-typescript
          config-file: .github/codeql-config.yml

      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v3

      # 3. SAST â€” ESLint Security
      - name: ESLint Security
        run: npx eslint . --config .eslintrc.js --format sarif -o eslint-results.sarif

      # 4. SCA â€” npm audit
      - name: npm audit
        run: npm audit --audit-level=high
        continue-on-error: false

      # 5. SCA â€” Snyk
      - name: Snyk Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high --sarif-file-output=snyk.sarif

      # 6. Container scan (if Docker)
      - name: Trivy Scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-results.sarif'

      # 7. Upload all results to GitHub Security tab
      - name: Upload SARIF files
        uses: github/codeql-action/upload-sarif@v3
        with:
          sarif_file: .
```

#### Automation Checklist

```
  â”€ ESLint with security plugins runs in CI
  â”€ CodeQL (GitHub-native SAST) active
  â”€ Semgrep rules for framework-specific patterns (Nuxt, Supabase)
  â”€ npm audit blocks CI on critical/high vulnerabilities
  â”€ Snyk or similar SCA tool integrated
  â”€ Secret scanning (gitleaks) on every push
  â”€ Weekly DAST scan (OWASP ZAP) on staging
  â”€ Trivy or Docker Scout for container/file scanning
  â”€ All SARIF results uploaded to GitHub Security tab
  â”€ Security scans run on every PR (block merge on failure)
  â”€ Security findings reviewed weekly (or immediately if critical)
  â”€ SBOM generated per release
  â”€ Dependency updates reviewed in dedicated PRs (Dependabot)
  â”€ Audit log reviewed weekly for suspicious activity
  â”€ Penetration test scheduled quarterly (or after major features)
```

---

### 10.31 Secure File Storage, Signed URLs & CDN Security

#### Storage Architecture

```
THREE-TIER STORAGE:
  Tier 1: Supabase Storage (default for app files)
    â”€ Invoices, contracts, project files, client uploads
    â”€ RLS integrated with database auth
    â”€ Max file size: 50MB per file (Supabase limit)
    â”€ Storage buckets: clients, invoices, projects, contracts, public

  Tier 2: CDN (Cloudflare / Supabase CDN)
    â”€ Cached images, static assets, logos
    â”€ Signed URLs for private content
    â”€ Edge caching reduces load on origin

  Tier 3: Backup / Archive (S3-compatible storage)
    â”€ Old files, backup archives, compliance data
    â”€ Glacier/Deep Archive for long-term retention
```

#### Supabase Storage Security

```sql
-- Supabase Storage RLS policies

-- Bucket: client-files (private per-client)
CREATE POLICY "Clients can read their own files"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'client-files'
  AND auth.uid() = (storage.foldername(name))[1]::uuid = auth.uid()
  -- Folder structure: client-files/{user_id}/{filename}
);

CREATE POLICY "Clients can upload their own files"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'client-files'
  AND auth.uid() = (storage.foldername(name))[1]::uuid = auth.uid()
  -- File extension validation
  AND storage.extension(name) IN ('pdf', 'jpg', 'jpeg', 'png', 'webp', 'docx')
  -- File size check (client-side upload, but also verify)
  AND (metadata->>'size')::int < 50 * 1024 * 1024
);

-- Bucket: public-assets (no auth required)
CREATE POLICY "Anyone can read public assets"
ON storage.objects
FOR SELECT
USING (bucket_id = 'public-assets');

-- Bucket: invoices (admin + owning client only)
CREATE POLICY "Invoices access"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'invoices'
  AND (
    -- Admin can read all
    auth.jwt() ->> 'role' = 'admin'
    OR
    -- Client can read own invoices
    auth.uid() = (storage.foldername(name))[1]::uuid
  )
);
```

#### Signed URLs (Time-Limited Access)

```js
// Supabase â€” generate signed URLs for private files
// Signed URLs expire, preventing unauthorized sharing

// Server-side (Nitro endpoint or Edge Function)
export default defineEventHandler(async (event) => {
  const { filePath, bucket } = await readBody(event);
  const user = event.context.user; // Authenticated

  // Verify user has access to this file
  const hasAccess = await checkFileAccess(user.id, bucket, filePath);
  if (!hasAccess) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' });
  }

  // Generate signed URL with 1-hour expiry
  const { data, error } = await supabase
    .storage
    .from(bucket)
    .createSignedUrl(filePath, 3600); // 1 hour in seconds

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return { signedUrl: data.signedUrl };
});

// Client-side â€” fetch signed URL when needed
const downloadFile = async (file) => {
  const { data, error } = await $fetch('/api/storage/signed-url', {
    method: 'POST',
    body: {
      bucket: file.bucket,
      filePath: file.path,
    },
  });

  if (data?.signedUrl) {
    // Open in new tab or trigger download
    window.open(data.signedUrl, '_blank');
  }
};
```

```php
// Laravel â€” signed URLs for local storage
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Storage;

public function getSignedFileUrl(Request $request, $fileId)
{
    $file = File::findOrFail($fileId);

    // Verify user has access
    $this->authorize('view', $file);

    // Generate temporary signed route (1 hour)
    $signedUrl = URL::temporarySignedRoute(
        'files.download',
        now()->addHour(),
        ['file' => $file->id]
    );

    return response()->json(['url' => $signedUrl]);
}
```

```bash
# AWS S3 â€” presigned URLs via CLI
aws s3 presign s3://your-bucket/file.pdf --expires-in 3600

# AWS SDK (Node)
const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const command = new GetObjectCommand({
  Bucket: 'your-bucket',
  Key: 'path/to/file.pdf',
});
const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
```

#### CDN & Hotlink Protection

```nginx
# Nginx â€” CDN hotlink prevention
# Only allow your domain to embed images/videos

location ~* \.(jpg|jpeg|png|gif|webp|svg|mp4|avi)$ {
    valid_referers none blocked server_names
        ~\.amin670bd\.com
        ~\.vercel\.app    # For dev/staging previews
        ~\.supabase\.co   # Allow Supabase CDN
        ~\.googleusercontent\.com  # Allow Google cache
        ~\.facebook\.com  # Allow Facebook preview;

    if ($invalid_referer) {
        return 403;
    }
}
```

```bash
# Cloudflare â€” hotlink protection
# Cloudflare Dashboard â†’ Speed â†’ Optimization â†’ Hotlink Protection
# Or via API:
# curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/hotlink_protection" \
#   -H "Authorization: Bearer $TOKEN" \
#   -H "Content-Type: application/json" \
#   -d '{"value":"on"}'
```

#### File Upload Sanitization

```js
// Nuxt / Nitro â€” secure file upload handler
export default defineEventHandler(async (event) => {
  const formData = await readFormData(event);
  const file = formData.get('file');

  if (!file) throw createError({ statusCode: 400, statusMessage: 'No file uploaded' });

  // 1. Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    throw createError({ statusCode: 413, statusMessage: 'File too large' });
  }

  // 2. Check MIME type (server-side, not client-reported)
  const allowedMimes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/zip',
  ];

  // Node: mime-type check via file-type
  const { fileTypeFromBuffer } = await import('file-type');
  const buffer = await file.arrayBuffer();
  const type = await fileTypeFromBuffer(buffer);

  if (!type || !allowedMimes.includes(type.mime)) {
    throw createError({ statusCode: 422, statusMessage: 'File type not allowed' });
  }

  // 3. Rename to UUID (prevents path traversal + filename attacks)
  const { v4: uuidv4 } = await import('uuid');
  const ext = type.ext;
  const safeName = `${uuidv4()}.${ext}`;

  // 4. Upload to Supabase Storage (RLS-enforced)
  const { data, error } = await supabase
    .storage
    .from('client-files')
    .upload(`${event.context.user.id}/${safeName}`, buffer, {
      contentType: type.mime,
      upsert: false,
    });

  if (error) throw createError({ statusCode: 500, statusMessage: error.message });

  return { path: data.path };
});
```

#### File Security Checklist

```
  â”€ Storage buckets have RLS policies
  â”€ Private files use signed URLs with 1-hour expiry
  â”€ File uploads validated: size, MIME, magic bytes, extension whitelist
  â”€ Files renamed to UUID on upload (never trust client filename)
  â”€ Antivirus scanning (ClamAV) on all uploads
  â”€ Hotlink protection enabled (CDN level)
  â”€ CORS configured for storage endpoints (only your frontend domain)
  â”€ Storage bucket NOT publicly listable (no directory traversal)
  â”€ File download requires authentication + authorization
  â”€ Backup storage separately with encryption at rest
  â”€ Video/images served via CDN (Cloudflare)
  â”€ Expired files cleaned up (temp uploads 24h TTL)
  â”€ No executable files allowed (.exe, .sh, .php, .py, etc.)
```

---

### 10.32 Business Continuity & Disaster Recovery (Expanded)

#### Risk Assessment for Solo Agency

```
RISK                    LIKELIHOOD   IMPACT       MITIGATION
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Hardware failure        Medium       High         Cloud hosting (no single machine)
Cloud provider outage   Low          Critical     Multi-region plan, DNS failover
Data corruption         Low          Critical     PITR, daily backups, verification
Cyber attack            Medium       Critical     All security measures in this doc
Human error (you)       Medium       High         Automation, infrastructure-as-code
Sick / unavailable      Low          High         Runbooks, documented processes
Natural disaster        Very Low     Critical     Off-site backups, cloud hosting
Bankruptcy of provider  Very Low     Critical     Avoid lock-in (open source, portable)
```

#### Recovery Time Objectives

```
SERVICE                RTO           RPO           PRIORITY
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Website static pages   5 minutes     1 hour        High (public-facing)
Client portal          1 hour        1 hour        High (client-facing)
Dashboard (admin)      4 hours       24 hours      Medium (admin only)
Email delivery         1 hour        1 hour        High (client communication)
Payment processing     1 hour        1 hour        Critical (revenue)
File downloads         4 hours       24 hours      Medium
Backup system          4 hours       24 hours      Medium
Analytics/reports      24 hours      1 week        Low
```

#### Automated Recovery

```bash
#!/bin/bash
# Auto-recovery script â€” run on server startup via cron/systemd

# 1. Check if app is running
if ! curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
    echo "[$(date)] App not responding. Attempting restart..."

    # 2. Attempt restart
    docker-compose restart app

    sleep 10

    # 3. Check again
    if ! curl -sf http://localhost:3000/api/health > /dev/null 2>&1; then
        echo "[$(date)] Restart failed. Failing over..."

        # 4. If Cloudflare: change DNS to backup IP
        # curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE/dns_records/$RECORD" \
        #   -H "Authorization: Bearer $TOKEN" \
        #   -d '{"content":"BACKUP_SERVER_IP"}'
    fi
fi
```

#### Backup Verification

```bash
#!/bin/bash
# Monthly backup restoration test
# Run: 0 6 1 * * /root/scripts/test-restore.sh

BACKUP_FILE=$(aws s3 ls s3://backups/db/$(date +%Y/%m/%d).dump | tail -1 | awk '{print $4}')

if [ -z "$BACKUP_FILE" ]; then
    echo "âŒ No backup found for today!"
    exit 1
fi

# Download and verify backup integrity
aws s3 cp s3://backups/db/$BACKUP_FILE /tmp/test-restore.dump

# Check pg_dump custom format integrity
pg_restore --list /tmp/test-restore.dump > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "âŒ Backup file is corrupted!"
    exit 1
fi

# Verify key tables have data
pg_restore --list /tmp/test-restore.dump | grep -q "TABLE clients"
if [ $? -ne 0 ]; then
    echo "âŒ Backup missing clients table!"
    exit 1
fi

echo "âœ… Backup verified: $(date +%Y-%m-%d)"
rm /tmp/test-restore.dump

# Send success notification
# curl -X POST $WEBHOOK_URL -d '{"text":"âœ… Backup verified: $(date +%Y-%m-%d)"}'
```

#### Runbook: Complete App Restore

```bash
# COMPLETE APP RESTORE FROM SCRATCH
# Estimated time: 1-2 hours
# Prerequisites: Access to GitHub, Vercel, Supabase, Cloudflare

#!/bin/bash
set -euo pipefail

echo "=== AGENCY CRM DISASTER RECOVERY ==="
echo "Step 1: Verify DNS"
echo "  Check Cloudflare dashboard â†’ DNS records intact"
echo "  If nameservers changed: restore at registrar"

echo "Step 2: Restore Database (Supabase)"
echo "  Supabase Dashboard â†’ Database â†’ Backups â†’ Restore"
echo "  OR via CLI:"
echo "  supabase db restore --db-url $SUPABASE_URL"

echo "Step 3: Restore Storage (Supabase)"
echo "  Files backed up to S3. Restore:"
echo "  aws s3 sync s3://backup-bucket/files/ s3://app-bucket/"

echo "Step 4: Redeploy Application"
echo "  Vercel: git push â†’ auto-deploy"
echo "  OR: vercel --prod"

echo "Step 5: Restore Secrets"
echo "  Doppler: doppler setup â†’ doppler secrets download"

echo "Step 6: Verify"
echo "  curl -I https://amin670bd.com (200 OK)"
echo "  curl -I https://dashboard.amin670bd.com/api/health (200 OK)"
echo "  curl -X POST https://api.amin670bd.com/api/auth/login (test login)"
echo "  Check Stripe webhooks are active"
echo "  Check Resend email delivery"
echo "  Verify client data count matches backup manifest"

echo "Step 7: Post-Recovery"
echo "  Rotate ALL secrets (DB, API keys, Stripe, Resend)"
echo "  Run security scan"
echo "  Notify any affected clients"
echo "  Document root cause"
echo "=== RECOVERY COMPLETE ==="
```

#### Disaster Recovery Checklist

```
  â”€ Backups automated and stored off-site (different region)
  â”€ Backups encrypted (AES-256) with key separate from backup
  â”€ Backup restoration tested monthly (automated script)
  â”€ Infrastructure-as-code (Docker Compose, Terraform, or script)
  â”€ Runbook documented (this section) and accessible offline
  â”€ All secrets accessible via secrets manager (not just local .env)
  â”€ Multi-region DNS failover configured (Cloudflare)
  â”€ Communication plan: email, social media, client notification template
  â”€ Key contacts documented (hosting support, registrar, bank)
  â”€ Insurance: consider cyber insurance for agency
  â”€ BCDR plan reviewed quarterly
  â”€ Recovery tested end-to-end at least annually
```

---

### 10.33 Security Awareness & Operational Security (Solo Agency)

#### The Human Factor

```
For a solo agency, YOU are the most critical security control.
  â”€ Your password habits
  â”€ Your device security
  â”€ Your network security
  â”€ Your response to social engineering
  â”€ Your backup discipline
```

#### Personal Device Security

```
WORKSTATION (your development machine):
  â”€ Full disk encryption (BitLocker / FileVault / LUKS) â€” REQUIRED
  â”€ Screen lock: 5 minutes inactivity
  â”€ Automatic updates enabled (OS + all software)
  â”€ Antivirus active (Windows Defender is sufficient)
  â”€ No admin account for daily use (use standard user)
  â”€ Separate browser profile for work (Chrome profiles, Firefox containers)
  â”€ No saved passwords in browser (use password manager)
  â”€ VPN for public WiFi (WireGuard or Tailscale)
  â”€ Firewall enabled (default deny incoming)
  â”€ Remote access disabled unless needed (and then only via VPN)

PHONE (2FA device):
  â”€ PIN/biometric lock
  â”€ TOTP app: 2FAS, Aegis, or Raivo (open source, encrypted backup)
  â”€ No Google Authenticator (no encrypted backup)
  â” NO SMS 2FA where possible (SIM swap attack)
  â”€ Automatic updates
  â”€ Minimal app installs (fewer attack vectors)
```

#### Password Manager Usage

```
USE A PASSWORD MANAGER (no exceptions):
  â”€ Bitwarden (RECOMMENDED â€” open source, affordable, self-host option)
  â”€ 1Password (great UX, polished)
  â”€ KeePassXC (free, local-only)

PASSWORD MANAGER RULES:
  â”€ Master password: 5+ random words (diceware), 40+ characters
  â”€ Master password: NEVER typed on any device except your own
  â”€ 2FA enabled on password manager account (TOTP or hardware key)
  â”€ All passwords auto-generated: 20+ random characters
  â”€ Every account gets unique password
  â”€ Emergency sheet: master password + 2FA recovery codes in safe deposit box
  â”€ Browser extension only, no clipboard copy (auto-fill in forms)

WHAT TO STORE IN PASSWORD MANAGER:
  â”€ All online accounts (email, hosting, registrar, cloud services)
  â”€ API keys and tokens (as secure notes)
  â”€ SSH keys (as attachments)
  â”€ Database passwords
  â”€ Recovery codes for every service
  â”€ Software licenses
  â”€ Domain registrar credentials
  â”€ Social media accounts
```

#### Social Engineering Awareness

```
TOP ATTACKS TARGETING SOLO AGENCIES:
  1. Fake client email: "I'm interested in your services. Click this link to view my brief."
     â†’ Phishing link â†’ credential theft
     â†’ DEFENSE: Hover before click. Verify sender domain. Don't trust attachments.

  2. Impersonation: "This is Supabase support. We detected unusual activity. Confirm your password."
     â†’ Credential harvesting
     â†’ DEFENSE: Never share passwords. Verify via official channels.

  3. Urgent invoice: "This invoice is overdue. Click to pay."
     â†’ Payment to attacker
     â†’ DEFENSE: Cross-check invoice numbers in dashboard. Never click "pay" from email.

  4. Fake collaboration: "I'm a developer. Can you add me to your GitHub as collaborator?"
     â†’ Supply chain attack
     â†’ DEFENSE: Never add unknown users. Require video call first.

  5. Support scam: "Your domain is expiring. Renew now."
     â†’ Credentials + payment
     â†’ DEFENSE: Check domain status in registrar dashboard directly.

RULE: If it's unexpected, urgent, or asks for credentials â€” it's probably an attack.
      Verify through a DIFFERENT channel (call the person, not the number in the email).
```

#### Communication Security

```
  â”€ Client communication: Portal (encrypted messages) or ProtonMail
  â”€ Internal notes: Encrypted at rest in app
  â”€ File sharing: Signed URLs in portal (not email attachments)
  â”€ Password sharing: NEVER via email/Slack/WhatsApp â€” use portal or password manager share
  â”€ Sensitive document sharing: Portal with access logs
  â”€ Video calls: End-to-end encrypted (Zoom with E2EE, Signal, or Jitsi)
  â”€ Team chat: Matrix / Signal (not SMS, not WhatsApp for business)
```

#### Operational Security Checklist

```
  â”€ Full disk encryption on all devices
  â”€ Screen lock with 5-min timeout
  â”€ Automatic updates enabled everywhere
  â”€ Password manager active (unique 20-char passwords per site)
  â”€ 2FA on ALL accounts (no SMS, use TOTP or hardware key)
  â”€ Recovery codes stored securely (safe deposit box or encrypted backup)
  â”€ No password sharing via email/chat
  â”€ Suspicious emails verified before click/response
  â”€ VPN used on public WiFi
  â”€ Separate browser profile for work
  â”€ Regular audit: which services have access to your data
  â”€ Regular cleanup: remove unused accounts, revoke unused API keys
  â”€ Security-focused mindset: question unexpected requests
  â”€ Incident response contact list accessible offline
```

---

### 10.34 API Deep Security (Keys, HMAC, Gateway, Webhook Hardening)

#### API Key Security Model

```
TYPES OF API KEYS IN YOUR SYSTEM:
  1. Third-party keys (Stripe, Resend, Supabase)
     â†’ Stored in secrets manager, never in code
     â†’ Scoped to minimum permissions at provider dashboard

  2. Customer-facing API keys (for hypothetical future integrations)
     â†’ Generated per-client, prefixed for identification (sk_live_v3_xxx)
     â†’ Hashed in database (like passwords â€” bcrypt or SHA-256)
     â†’ Only shown once at creation time
     â†’ Revocable individually

  3. Internal service keys (for microservices)
     â†’ Rotated frequently, not shared across services

KEY FORMAT BEST PRACTICES:
  â”€ Prefix identifies the key type (sk_live_, pk_test_, whsec_)
  â”€ Versioned (v1_, v2_, v3_) for future rotation
  â”€ Minimum 32 bytes of entropy (base64 encoded â†’ 44 chars)
  â”€ Starts with identifiable prefix for easy revocation
```

#### HMAC Request Signing

```js
// HMAC signing for server-to-server communication
// Prevents request tampering + provides authentication

// Server A â€” sign request
const crypto = require('crypto');

function signRequest(method, path, body, timestamp, secret) {
  const message = [
    timestamp,
    method.toUpperCase(),
    path,
    JSON.stringify(body),  // Canonical JSON (sorted keys)
  ].join('\n');

  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(message);
  return hmac.digest('hex');
}

// Usage when sending to Server B
const timestamp = Date.now().toString();
const signature = signRequest('POST', '/api/webhook', payload, timestamp, SHARED_SECRET);

await fetch('https://server-b.com/api/webhook', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Signature': signature,
    'X-Timestamp': timestamp,
  },
  body: JSON.stringify(payload),
});
```

```php
// Server B â€” verify HMAC signature
function verifySignature(Request $request, string $secret): bool
{
    $signature = $request->header('X-Signature');
    $timestamp = $request->header('X-Timestamp');

    // 1. Check timestamp freshness (max 5 minute skew)
    if (abs(time() - (int)$timestamp) > 300) {
        return false; // Replay attack
    }

    // 2. Recreate signature
    $message = implode("\n", [
        $timestamp,
        $request->method(),
        $request->path(),
        $request->getContent(),
    ]);

    $expected = hash_hmac('sha256', $message, $secret);

    // 3. Constant-time comparison
    return hash_equals($expected, $signature);
}

// Middleware
public function handle(Request $request, Closure $next)
{
    $secret = config('services.internal.shared_secret');

    if (!verifySignature($request, $secret)) {
        Log::warning('Invalid HMAC signature', [
            'ip' => $request->ip(),
            'path' => $request->path(),
        ]);
        return response()->json(['error' => 'Invalid signature'], 401);
    }

    return $next($request);
}
```

#### Webhook Hardening (Universal)

```js
// Webhook endpoints are special: they receive data from external services.
// They must be hardened separately.

// Node â€” Stripe webhook with all safeguards
app.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  // 1. Verify webhook secret
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.warn('Stripe webhook signature invalid', { ip: req.ip, error: err.message });
    return res.status(400).json({ error: 'Invalid signature' });
  }

  // 2. Verify source IP (Stripe publishes their IP ranges)
  const allowedIPs = ['3.18.12.0/23', '3.130.192.0/22', ...]; // Stripe CIDR ranges
  if (!ipRangeCheck(req.ip, allowedIPs)) {
    logger.warn('Stripe webhook from unexpected IP', { ip: req.ip });
    return res.status(403).json({ error: 'Forbidden' });
  }

  // 3. Idempotency â€” process each event exactly once
  const idempotencyKey = `stripe_${event.id}`;
  const processed = await checkIdempotency(idempotencyKey);
  if (processed) {
    return res.json({ received: true }); // Already processed
  }

  // 4. Validate event type
  const allowedEvents = [
    'checkout.session.completed',
    'invoice.paid',
    'invoice.payment_failed',
    'customer.subscription.updated',
  ];

  if (!allowedEvents.includes(event.type)) {
    return res.json({ received: true }); // Acknowledge but ignore
  }

  // 5. Process event (with database transaction)
  try {
    await db.transaction(async (trx) => {
      // Verify the event data matches our expectations
      // Don't trust the client ID from the event without verifying it belongs to us
      await handleStripeEvent(event, trx);

      // Mark as processed
      await markIdempotent(idempotencyKey, trx);
    });
  } catch (err) {
    logger.error('Webhook processing failed', { event: event.id, error: err.message });
    return res.status(500).json({ error: 'Processing failed' });
  }

  res.json({ received: true });
});
```

```php
// Laravel â€” Resend webhook verification
public function handleResendWebhook(Request $request)
{
    // 1. Verify signature
    $signature = $request->header('Resend-Signature');
    $timestamp = $request->header('Resend-Timestamp');

    $payload = $timestamp . '.' . $request->getContent();
    $expected = hash_hmac('sha256', $payload, config('services.resend.webhook_secret'));

    if (!hash_equals($expected, $signature)) {
        Log::warning('Resend webhook signature invalid', ['ip' => $request->ip()]);
        return response()->json(['error' => 'Invalid signature'], 401);
    }

    // 2. Replay protection (check timestamp within 5 minutes)
    if (abs(now()->timestamp - (int)$timestamp) > 300) {
        return response()->json(['error' => 'Stale timestamp'], 401);
    }

    // 3. Process webhook
    $payload = $request->all();
    // ... handle event
}
```

#### Webhook Common Pitfalls

```
WEBHOOK SECURITY MISTAKES:
  âŒ Not verifying webhook signature
  âŒ Processing the same event twice (missing idempotency)
  âŒ Responding with 200 without processing (ack but you'll get retries)
  âŒ Trusting webhook payload without verifying it references your data
  âŒ Not filtering by allowed event types
  âŒ Logging raw request body (may contain secrets)
  âŒ Processing synchronously (blocking other webhooks)
  âŒ Not handling webhook failure (retry logic, alerting)

âœ… BEST PRACTICES:
  â”€ Always verify signature before any processing
  â”€ Maintain idempotency (event ID â†’ processed flag)
  â”€ Respond with 200 quickly, process async (queue)
  â”€ Validate that event data references entities in YOUR system
  â”€ Filter event types (don't blindly process everything)
  â”€ Use a queue for processing (Redis/Bull/Beanstalkd)
  â”€ Alert on webhook failure (retry queue dead letter)
  â”€ Log webhook receipt but NOT the full payload (personal data may be present)
  â”€ Keep webhook secret separate from other secrets
```

#### API Gateway Patterns

```nginx
# Nginx as API Gateway â€” additional security layer before app

# 1. Rate limiting per endpoint group
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;
limit_req_zone $binary_remote_addr zone=api:10m rate=60r/m;
limit_req_zone $binary_remote_addr zone=upload:10m rate=5r/m;

# 2. Block dangerous HTTP methods
if ($request_method !~ ^(GET|POST|PATCH|DELETE)$) {
    return 405;
}

# 3. Block specific content types on non-upload endpoints
location /api/ {
    # Block XML external entity attacks
    if ($http_content_type ~* "text/xml|application/xml") {
        return 415;
    }

    limit_req zone=api burst=30 nodelay;
    proxy_pass http://localhost:3000;
}

# 4. Request size limits
location /api/upload {
    client_max_body_size 12M;
    limit_req zone=upload burst=5 nodelay;
    proxy_pass http://localhost:3000;
}

# 5. IP allowlist for admin-only endpoints
location /api/admin {
    allow 192.168.1.0/24;  # Office IP
    allow 103.xxx.xxx.xxx;  # Your home IP
    deny all;

    proxy_pass http://localhost:3000;
}
```

#### API Security Checklist

```
  â”€ API keys prefixed, versioned, and have 32+ bytes entropy
  â”€ API keys hashed in database (like passwords)
  â”€ HMAC signing for server-to-server calls
  â”€ Webhook signatures verified on EVERY incoming webhook
  â”€ Webhook idempotency (event ID tracked in database)
  â”€ Webhook source IP verified (where provider publishes ranges)
  â”€ Webhook processing via queue (not synchronous)
  â”€ Alerting on webhook failures
  â”€ Dangerous HTTP methods blocked (PUT, TRACE, CONNECT, etc.)
  â”€ Request size limits at gateway level
  â”€ Rate limiting per endpoint group
  â”€ IP allowlist for sensitive admin endpoints
  â”€ API keys revocable individually without affecting others
  â”€ API key usage logged (audit trail)
  â”€ API response doesn't expose internal structure
  â”€ Error messages don't reveal whether entity exists (prevents enumeration)
```

---

### Summary: Threat Matrix

```
THREAT                      SEVERITY    DEFENSE LAYERS
â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
SQL Injection               ðŸ”´ Critical   ORM + parameterized queries + WAF
XSS                         ðŸ”´ Critical   CSP + DOMPurify + output encoding
Authentication bypass       ðŸ”´ Critical   MFA + session rotation + rate limiting
Broken access control       ðŸ”´ Critical   RLS + policies + middleware
Data breach                 ðŸ”´ Critical   Encryption + audit trail + backups
Brute force login           ðŸŸ¡ High       Rate limiting + lockout + MFA
CSRF                        ðŸŸ¡ High       CSRF tokens + SameSite cookies
File upload malware         ðŸŸ¡ High       ClamAV + magic bytes + type validation
Session hijacking           ðŸŸ¡ High       httpOnly + Secure + fingerprinting
Payment fraud               ðŸŸ¡ High       Stripe Radar + webhook verification
DDoS                        ðŸŸ¡ High       Cloudflare + rate limiting + scaling
Supply chain (dependency)   ðŸŸ¡ High       npm audit + Dependabot + Snyk
MITM (Man-in-the-middle)    ðŸŸ¡ High       TLS 1.3 + HSTS + certificate pinning
SSRF                        ðŸŸ¡ High       Outbound allowlist + URL validation
IDOR (Insecure direct obj)  ðŸŸ¡ High       RLS + ownership checks + audit log
Business logic abuse        ðŸŸ  Medium     Rate limiting + idempotency + validation
Information disclosure      ðŸŸ  Medium     Safe error handling + no debug mode
Session fixation            ðŸŸ  Medium     Regenerate session ID on login
Clickjacking                ðŸŸ  Medium     X-Frame-Options: DENY
Open redirect               ðŸŸ  Medium     URL allowlist for redirects
Spam / bot abuse            ðŸŸ  Medium     Honeypot + CAPTCHA + rate limiting
DNS spoofing                ðŸŸ  Medium     DNSSEC + SSL + HSTS
Email spoofing              ðŸŸ  Medium     SPF + DKIM + DMARC
```

---

*Generated: 2026-06-08*

