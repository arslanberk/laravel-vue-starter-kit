<script setup>
import { useHead } from '@vueuse/head'

// SEO meta data for terms of service page
useHead({
  title: 'Terms of Service - Laravel App',
  meta: [
    { name: 'description', content: 'Terms of Service for Laravel App' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Terms of Service - Laravel App' },
    { property: 'og:description', content: 'Terms of Service for Laravel App' },
    { property: 'og:type', content: 'article' }
  ]
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="prose prose-gray max-w-none">
      <h1 class="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <p class="text-muted-foreground mb-6">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
        <p class="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. By accessing and using Laravel App, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        <p class="mb-4">
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. Use License</h2>
        <p class="mb-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        <p class="mb-4">Permission is granted to temporarily use our service for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to reverse engineer any software</li>
          <li>Remove any copyright or other proprietary notations</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Disclaimer</h2>
        <p class="mb-4">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
        <p class="mb-4">
          The materials on Laravel App's website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Limitations</h2>
        <p class="mb-4">
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </p>
        <p class="mb-4">
          In no event shall Laravel App or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Accuracy of Materials</h2>
        <p class="mb-4">
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. The materials appearing on our website could include technical, typographical, or photographic errors.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Links</h2>
        <p class="mb-4">
          Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">7. Modifications</h2>
        <p class="mb-4">
          Laravel App may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">8. Contact Information</h2>
        <p class="mb-4">
          If you have any questions about these Terms of Service, please contact us at:
        </p>
        <p class="mb-4">
          <strong>Email:</strong> legal@example.com<br>
          <strong>Address:</strong> 123 Legal Street, Terms City, TC 12345
        </p>
      </section>
    </div>
  </div>
</template> 