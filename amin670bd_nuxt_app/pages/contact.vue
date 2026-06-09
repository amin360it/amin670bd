<template>
  <div class="section">
    <span class="section-tag">Get In Touch</span>
    <h1 class="section-title">Contact Me</h1>
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div class="lg:col-span-2 space-y-5">
        <div class="card-glass p-6 contact-info">
          <div class="space-y-3 text-lg">
            <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">phone</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone1 }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.phone2 }}</div></div></div>
            <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">email</i><div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email }}</div><div class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.email2 }}</div></div></div>
            <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i><span>{{ DATA.personal.location }}</span></div>
            <div class="flex items-center gap-3"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" style="color:var(--primary)"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zm-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79zM6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68zm1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg><a :href="'https://' + DATA.personal.linkedin" target="_blank" class="hover:underline">{{ DATA.personal.linkedin }}</a></div>
            <div class="flex items-center gap-3"><i class="material-icons" style="color:var(--primary);font-size:18px">language</i><a :href="DATA.personal.website" target="_blank" class="hover:underline">{{ DATA.personal.website }}</a></div>
          </div>
        </div>

        <div class="card-glass p-6">
          <h3 class="text-lg font-bold mb-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">info</i>Availability</h3>
          <div class="space-y-2 text-lg">
            <div class="flex justify-between"><span style="color:var(--text-label)">Available</span><span class="font-medium" style="color:var(--text-heading)">{{ DATA.personal.available }}</span></div>
            <div class="flex justify-between"><span style="color:var(--text-label)">Relocation</span><span class="font-medium" style="color:var(--text-heading)">Yes</span></div>
          </div>
        </div>

        <div class="card-glass p-6">
          <h3 class="text-lg font-bold mb-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">location_on</i>Location</h3>
          <div class="card-glass--glass flex items-start gap-3 p-4 rounded-xl mb-3" style="display:flex">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
              <i class="material-icons text-white" style="font-size:16px">location_on</i>
            </div>
            <div>
              <h4 class="font-semibold text-sm" style="color:var(--text-heading)">{{ DATA.personal.location }}</h4>
              <p class="text-xs mt-0.5" style="color:var(--text)">Current Location</p>
            </div>
          </div>
          <a :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(DATA.personal.location)" target="_blank" class="card-glass--glass flex items-start gap-3 p-4 rounded-xl" style="text-decoration:none;display:flex">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 gradient-bg">
              <i class="material-icons text-white" style="font-size:16px">map</i>
            </div>
            <div>
              <h4 class="font-semibold text-sm" style="color:var(--primary)">View on Google Maps</h4>
              <p class="text-xs mt-0.5" style="color:var(--text)">Open in Google Maps</p>
            </div>
          </a>
        </div>
      </div>

      <div class="lg:col-span-3">
        <div class="card-glass p-6">
          <h3 class="text-lg font-bold mb-4 flex items-center gap-3" style="color:var(--text-heading)"><i class="material-icons" style="color:var(--primary);font-size:18px">send</i>Send a Message</h3>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Your Name</label>
              <input v-model="form.name" @blur="validateField('name')" type="text" class="contact-input w-full px-4 py-2.5 rounded-xl" :class="{ error: formError.name, success: formSuccess.name }" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text)" placeholder="John Doe">

              <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Your Email</label>
              <input v-model="form.email" @blur="validateField('email')" type="email" class="contact-input w-full px-4 py-2.5 rounded-xl" :class="{ error: formError.email, success: formSuccess.email }" style="background:var(--bg-card);border:1px solid var(--border);color:var(--text)" placeholder="john@example.com">

              <label class="text-md font-medium mb-1 block" style="color:var(--text-label)">Message</label>
              <textarea v-model="form.message" required class="contact-input" :class="{ error: formError.message, success: formSuccess.message }" placeholder="Write your message..." @blur="validateField('message')"></textarea>
            </div>
            <button type="submit" :disabled="submitted" class="btn-shimmer w-full py-3 px-6 gradient-bg text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2" :style="{opacity: submitted ? 0.7 : 1}">
              <i class="material-icons" :class="{ 'animate-spin': submitted }">{{ submitted ? 'sync' : 'send' }}</i> {{ submitted ? 'Sending...' : 'Send Message' }}
            </button>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showSuccess" class="success-overlay" @click.self="closeModal">
      <div class="success-card">
        <div class="success-check">
          <svg viewBox="0 0 24 24">
            <polyline points="4,13 9,18 20,6" />
          </svg>
        </div>
        <span class="success-tag">Success</span>
        <h3 class="success-title">Message Sent!</h3>
        <p class="success-text">
          Thank you for reaching out. Your message has been routed to
          <strong>Md. Asaduzzaman (Aminur)</strong>.
          You can expect a response within 24 hours.
        </p>
        <button @click="closeModal" class="success-btn">OK</button>
      </div>
    </div>

    <div v-if="showError" class="success-overlay" @click.self="closeModal">
      <div class="success-card error-card">
        <div class="success-check error-check">
          <svg viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" stroke-width="4" stroke-linecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke-width="4" stroke-linecap="round" />
          </svg>
        </div>
        <span class="success-tag error-tag">Failed</span>
        <h3 class="success-title error-title">Message Not Sent</h3>
        <p class="success-text error-text">{{ errorMessage }}</p>
        <button @click="closeModal" class="success-btn error-btn">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useData } from '~/composables/useData'
export default {
  name: 'ContactView',
  data() {
    return {
      DATA: useData(),
      form: { name: '', email: '', message: '' },
      submitted: false,
      showSuccess: false,
      showError: false,
      errorMessage: '',
      formError: { name: false, email: false, message: false },
      formSuccess: { name: false, email: false, message: false }
    }
  },
  methods: {
    validateField(field) {
      if (this.form[field].trim()) {
        this.formError[field] = false
        this.formSuccess[field] = true
      } else {
        this.formError[field] = true
        this.formSuccess[field] = false
      }
    },
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) return 'Please enter a valid email address.'
      const [local, domain] = email.split('@')
      if (local.length > 64) return 'Email username is too long.'
      if (domain.length > 255) return 'Email domain is too long.'
      const fakePatterns = ['test@', 'asdf@', '123@', 'abc@', 'qwerty@', 'example@', 'user@', 'admin@']
      if (fakePatterns.some(p => email.toLowerCase().startsWith(p))) return 'Please use a real email address.'
      const tld = domain.split('.').pop().toLowerCase()
      const fakeTlds = ['localhost', 'test', 'example', 'invalid', 'fake', 'local']
      if (fakeTlds.includes(tld)) return 'Please use a real email address.'
      const DISPOSABLE_DOMAINS = ['mailinator.com','guerrillamail.com','tempmail.com','throwaway.com','yopmail.com','10minutemail.com','trashmail.com','sharklasers.com','maildrop.cc','getairmail.com','temp-mail.org','fakeinbox.com','dispostable.com','mailcatch.com','spambox.us','mailexpire.com','mintemail.com','spamgourmet.com','spamfree24.org','wh4f.org']
      if (DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) return 'Temporary email addresses are not allowed. Please use a permanent email.'
      const TYPO_DOMAINS = {'gamil.com':'gmail.com','gmial.com':'gmail.com','gmal.com':'gmail.com','yaho.com':'yahoo.com','yahooo.com':'yahoo.com','hotmal.com':'hotmail.com','hotnail.com':'hotmail.com','hotmil.com':'hotmail.com','outlok.com':'outlook.com','outllok.com':'outlook.com','protonmil.com':'protonmail.com','protonmal.com':'protonmail.com'}
      if (TYPO_DOMAINS[domain.toLowerCase()]) return `Did you mean ${TYPO_DOMAINS[domain.toLowerCase()]}? (You typed: ${domain})`
      return null
    },
    submitForm() {
      ;['name', 'email', 'message'].forEach(f => this.validateField(f))
      if (this.form.name && this.form.email && this.form.message) {
        const emailErr = this.validateEmail(this.form.email)
        if (emailErr) {
          this.formError.email = true
          this.showError = true
          this.errorMessage = emailErr
          return
        }
        this.submitted = true
        const formData = new FormData()
        formData.append('access_key', '10c1a904-df2c-4b15-8e7c-6407e5ae6943')
        formData.append('name', this.form.name)
        formData.append('email', this.form.email)
        formData.append('message', this.form.message)
        fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
          .then(res => res.json())
          .then(data => {
            if (data.success) {
              this.showSuccess = true
            } else {
              this.showError = true
              this.errorMessage = data.message || 'Failed to send message. Please try again later.'
              this.submitted = false
            }
          })
          .catch(() => {
            this.showError = true
            this.errorMessage = 'Network error: Could not reach the mail server. Please check your connection and try again.'
            this.submitted = false
          })
      }
    },
    closeModal() {
      const wasError = this.showError
      this.showSuccess = false
      this.showError = false
      this.errorMessage = ''
      this.submitted = false
      if (wasError) {
        Object.keys(this.formError).forEach(k => this.formError[k] = false)
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false)
      } else {
        this.form = { name: '', email: '', message: '' }
        Object.keys(this.formError).forEach(k => this.formError[k] = false)
        Object.keys(this.formSuccess).forEach(k => this.formSuccess[k] = false)
      }
    }
  }
}
</script>
