<template>
  <div>
    <!-- Top Bar -->
    <div class="bg-blue-1000 text-blue-100 py-2 text-sm">
      <div class="container mx-auto px-4">
        🚀 1‑month free trial • Built for Africa’s hospitality market
      </div>
    </div>

    <!-- Check-In Hero Section -->
    <section class="bg-gradient-to-b from-blue-900 to-blue-800 text-white" id="checkin">
      <div class="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div>
          <span class="badge">Check‑In by Bookello</span>
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mt-4 mb-3">Faster Arrivals, Happier Guests</h1>
          <p class="text-blue-100 text-lg mb-6">
            Guests scan a QR, upload ID & reservation, confirm their booking, and arrive faster. Your team spends less time on paperwork and more on hospitality.
          </p>
          <ul class="text-blue-200 space-y-2">
            <li>• Scan to start (QR or pre‑arrival link)</li>
            <li>• ID & reservation uploads (Booking.com, Expedia, Airbnb, direct)</li>
            <li>• Validation, signatures, and instant confirmation</li>
            <li>• Fraud reduction, better reviews, accurate data</li>
          </ul>
        </div>
        <div class="bg-white rounded-xl shadow-lg p-5 text-gray-800">
          <h3 class="text-xl font-bold mb-2">Become a Provider</h3>
          <p class="text-gray-600 mb-4">We'll set you up in minutes.</p>
          <form @submit.prevent="submitForm" class="space-y-4">
            <div>
              <label class="block font-bold text-sm mb-1">Business / Property Name</label>
              <input 
                type="text" 
                placeholder="e.g., The Trekkers Rest Lodge" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                required 
              />
            </div>
            
            <div>
              <label class="block font-bold text-sm mb-1">Category</label>
              <select class="w-full px-4 py-2 border border-gray-300 rounded-lg" required>
                <option value="">Select category</option>
                <option>Hotel / Apartment</option>
                <option>Tour / Activity</option>
                <option>Car Rental</option>
                <option>Chef / Guide / Spa / Photographer</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-bold text-sm mb-1">Country</label>
                <input 
                  type="text" 
                  placeholder="Country" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  required 
                />
              </div>
              <div>
                <label class="block font-bold text-sm mb-1">City</label>
                <input 
                  type="text" 
                  placeholder="City" 
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                  required 
                />
              </div>
            </div>
            
            <div>
              <label class="block font-bold text-sm mb-1">Email</label>
              <input 
                type="email" 
                placeholder="you@business.com" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                required 
              />
            </div>
            
            <div>
              <label class="block font-bold text-sm mb-1">Phone</label>
              <input 
                type="tel" 
                placeholder="+250..." 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg" 
                required 
              />
            </div>
            
            <p class="text-gray-500 text-xs">
              By submitting you agree to be contacted about Bookello products.
            </p>
            
            <div class="flex flex-wrap gap-3">
              <button type="submit" class="btn-primary">
                Add Check‑In to My Account
              </button>
              <a href="#how" class="btn-outline">
                See Full Flow
              </a>
            </div>
          </form>
        </div>
      </div>
    </section>

    <!-- Marketplace Hero Section -->
    <section class="bg-gradient-to-b from-blue-800 to-blue-900 text-white border-t border-blue-700" id="marketplace-hero">
      <div class="container mx-auto px-4 py-16 grid md:grid-cols-2 gap-8">
        <div>
          <span class="badge bg-blue-800 text-white border-blue-700">Bookello Marketplace</span>
          <h1 class="text-4xl md:text-5xl font-bold leading-tight mt-4 mb-3">Grow Your Hospitality & Tourism Business with Bookello</h1>
          <p class="text-blue-100 text-lg mb-6">
            List your hotel, tours, car rentals, and professional services — all in one marketplace.
          </p>
          <div class="flex flex-wrap gap-3 mt-2">
            <a href="#apply" class="btn-primary">Start Free Trial</a>
            <a href="#how" class="btn-outline">See How It Works</a>
          </div>
        </div>
        <div></div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16" id="why">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-2">Why Bookello</h2>
        <p class="text-gray-600 mb-8">Marketplace + guest experience tools to grow bookings and deliver better stays.</p>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="feature-card">
            <h3 class="text-xl font-bold mb-3">Guest Experience Tools</h3>
            <p class="text-gray-600">Including <em>Check‑In by Bookello</em> for faster arrivals, clean data, and reputation protection.</p>
          </div>
          
          <div class="feature-card">
            <h3 class="text-xl font-bold mb-3">Marketing & Visibility</h3>
            <p class="text-gray-600">SEO, ads, and marketplace promotions to get discovered by more travelers.</p>
          </div>
          
          <div class="feature-card">
            <h3 class="text-xl font-bold mb-3">All‑in‑One Listings</h3>
            <p class="text-gray-600">Hotels, tours, car rentals, chefs, guides, spa, photographers — all in one account.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 bg-gray-50" id="how">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-6">How It Works</h2>
        <ol class="list-decimal list-inside space-y-2 text-gray-700">
          <li class="font-medium">Create your provider account and profile.</li>
          <li class="font-medium">Publish listings with photos, pricing, and availability.</li>
          <li class="font-medium">Get discovered via Bookello search, region pages, and campaigns.</li>
          <li class="font-medium">Manage leads & bookings; use Check‑In for properties.</li>
          <li class="font-medium">Grow with analytics and review tools.</li>
        </ol>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="py-16" id="pricing">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-2">Simple Pricing</h2>
        <p class="text-gray-600 mb-8">All plans include the Check‑In option for accommodation providers. 30‑day free trial on every plan.</p>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="pricing-card">
            <h3 class="text-xl font-bold mb-3">Basic</h3>
            <div class="price">$100<span>/mo</span></div>
            <p class="text-gray-600 italic mb-4"><em>$700 / year</em></p>
            <ul class="space-y-2 text-gray-700">
              <li>• 1 category</li>
              <li>• Leads & booking requests</li>
              <li>• Optional: Check‑In module</li>
            </ul>
          </div>
          
          <div class="pricing-card border-blue-300">
            <h3 class="text-xl font-bold mb-3">Premium</h3>
            <div class="price">$200<span>/mo</span></div>
            <p class="text-gray-600 italic mb-4"><em>$1,375 / year</em></p>
            <ul class="space-y-2 text-gray-700">
              <li>• All categories</li>
              <li>• Promotions + analytics</li>
              <li>• Check‑In included</li>
            </ul>
          </div>
          
          <div class="pricing-card">
            <h3 class="text-xl font-bold mb-3">Diamond</h3>
            <div class="price">$250<span>/mo</span></div>
            <p class="text-gray-600 italic mb-4"><em>$1,594 / year</em></p>
            <ul class="space-y-2 text-gray-700">
              <li>• Featured placement</li>
              <li>• Team onboarding</li>
              <li>• Advanced analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gray-50" id="apply">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">Ready to grow with Bookello and streamline guest arrivals?</h2>
        <a href="#checkin" class="btn-primary bg-blue-800 hover:bg-blue-900 text-white">
          Start Free Trial
        </a>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-blue-1000 text-blue-300 py-10">
      <div class="container mx-auto px-4 flex justify-between flex-wrap gap-4">
        <div>© {{ currentYear }} Bookello.life Ltd</div>
        <div>bookellolife@gmail.com • +257 894 833 57</div>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'BookelloPage',
  data() {
    return {
      currentYear: new Date().getFullYear()
    }
  },
  methods: {
    submitForm() {
      alert('Thanks! Your Bookello provider trial has been created.');
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.container {
  max-width: 1140px;
}

.badge {
  @apply inline-block px-4 py-1 rounded-full text-sm font-bold border;
}

.btn-primary {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-800 font-bold rounded-full;
}

.btn-outline {
  @apply inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-white text-white font-bold rounded-full;
}

.feature-card {
  @apply bg-white rounded-xl shadow-md p-5 border border-gray-200;
}

.pricing-card {
  @apply bg-white rounded-xl shadow-md p-6 border border-gray-200;
}

.price {
  @apply text-4xl font-extrabold text-gray-900;
}

.price span {
  @apply text-base font-normal;
}

.bg-blue-1000 {
  background-color: #061a3c;
}
</style>