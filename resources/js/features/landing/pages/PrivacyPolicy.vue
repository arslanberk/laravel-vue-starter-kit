<script setup>
import { useHead } from '@vueuse/head'

// SEO meta data for privacy policy page
useHead({
  title: 'Privacy Policy - Laravel App',
  meta: [
    { name: 'description', content: 'Privacy Policy for Laravel App - Learn how we protect your personal information and data.' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Privacy Policy - Laravel App' },
    { property: 'og:description', content: 'Privacy Policy for Laravel App - Learn how we protect your personal information and data.' },
    { property: 'og:type', content: 'article' }
  ]
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="prose prose-gray max-w-none">
      <h1 class="text-3xl font-bold mb-8">Privacy Policy</h1>
      
      <p class="text-muted-foreground mb-6">
        <strong>Effective Date:</strong> January 1, 2025
      </p>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p class="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p class="mb-4">
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
        <p class="mb-4">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
        </p>
        <ul class="list-disc list-inside mb-4 space-y-2">
          <li>To provide and maintain our services</li>
          <li>To process your transactions</li>
          <li>To send you technical notices and updates</li>
          <li>To respond to your comments and questions</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Information Sharing</h2>
        <p class="mb-4">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p class="mb-4">
          Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">5. Contact Information</h2>
        <p class="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <p class="mb-4">
          <strong>Email:</strong> privacy@example.com<br>
          <strong>Address:</strong> 123 Privacy Street, Data City, DC 12345
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">6. Changes to This Policy</h2>
        <p class="mb-4">
          Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.
        </p>
      </section>
    </div>
  </div>
</template> 