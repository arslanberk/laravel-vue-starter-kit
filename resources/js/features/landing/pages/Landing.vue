<script setup>
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Card } from '@/shared/components/ui/card'
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar'
import { useHead } from '@vueuse/head'

useHead({
  title: 'Laravel Vue Starter Kit',
  meta: [
    { name: 'description', content: 'A modern full-stack web application built with Laravel and Vue.js. Perfect for rapid development and scalable applications.' },
    { name: 'keywords', content: 'laravel, vue, starter kit, web development, full stack, modern web app' },
    { name: 'author', content: 'Laravel Vue Starter Kit' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Laravel Vue Starter Kit' },
    { name: 'og:description', content: 'A modern full-stack web application built with Laravel and Vue.js. Perfect for rapid development and scalable applications.' },
  ]
})
</script> 

<template>
  <div class="container mx-auto px-4 py-12">
    <!-- Hero Section -->
    <section class="text-center py-20">
      <Badge variant="outline" class="mb-6">
        ✨ Modern Full-Stack Development
      </Badge>
      <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        Build Modern Web Apps with 
        <span class="text-primary">Laravel & Vue</span>
      </h1>
      <p class="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        A complete starter kit featuring Laravel backend with Vue.js frontend, 
        authentication, user management, and modern UI components.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" class="px-8">
          Get Started
        </Button>
        <Button size="lg" variant="outline" class="px-8">
          View Documentation
        </Button>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Everything You Need to Build
        </h2>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          From authentication to user management, we've got all the essential features 
          to kickstart your next web application project.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Feature 1 -->
        <Card class="p-6">
          <div class="mb-4">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Authentication System</h3>
            <p class="text-muted-foreground">
              Complete user authentication with registration, login, password reset, 
              email verification, and two-factor authentication.
            </p>
          </div>
        </Card>

        <!-- Feature 2 -->
        <Card class="p-6">
          <div class="mb-4">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Modern UI Components</h3>
            <p class="text-muted-foreground">
              Beautiful, responsive UI components built with shadcn/ui and Tailwind CSS. 
              Dark mode support and mobile-first design included.
            </p>
          </div>
        </Card>

        <!-- Feature 3 -->
        <Card class="p-6">
          <div class="mb-4">
            <div class="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Developer Experience</h3>
            <p class="text-muted-foreground">
              Hot reload development, TypeScript support, modern build tools, 
              and organized project structure for scalable applications.
            </p>
          </div>
        </Card>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-20">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Trusted by Developers Worldwide
        </h2>
        <p class="text-lg text-muted-foreground">
          Join thousands of developers building amazing web applications
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Testimonial 1 -->
        <Card class="p-6">
          <div class="flex items-center mb-4">
            <Avatar class="mr-3">
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <p class="font-semibold">John Doe</p>
              <p class="text-sm text-muted-foreground">Full Stack Developer</p>
            </div>
          </div>
          <p class="text-muted-foreground">
            "This starter kit saved me weeks of development time. The authentication system 
            and UI components are exactly what I needed for my SaaS project."
          </p>
        </Card>

        <!-- Testimonial 2 -->
        <Card class="p-6">
          <div class="flex items-center mb-4">
            <Avatar class="mr-3">
              <AvatarFallback>SM</AvatarFallback>
            </Avatar>
            <div>
              <p class="font-semibold">Sarah Miller</p>
              <p class="text-sm text-muted-foreground">Frontend Developer</p>
            </div>
          </div>
          <p class="text-muted-foreground">
            "The Vue.js integration is seamless and the components are beautifully designed. 
            Perfect foundation for modern web applications."
          </p>
        </Card>

        <!-- Testimonial 3 -->
        <Card class="p-6">
          <div class="flex items-center mb-4">
            <Avatar class="mr-3">
              <AvatarFallback>MJ</AvatarFallback>
            </Avatar>
            <div>
              <p class="font-semibold">Mike Johnson</p>
              <p class="text-sm text-muted-foreground">Product Manager</p>
            </div>
          </div>
          <p class="text-muted-foreground">
            "Great architecture and clean code. Our team was able to prototype 
            and launch our MVP in record time."
          </p>
        </Card>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20">
      <Card class="p-12 text-center bg-primary text-primary-foreground">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Ready to Build Something Amazing?
        </h2>
        <p class="text-lg opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of developers who are already building successful web applications 
          with our modern Laravel Vue starter kit.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" class="px-8">
            Start Building Today
          </Button>
          <Button size="lg" variant="outline" class="px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
            View Source Code
          </Button>
        </div>
      </Card>
    </section>
  </div>
</template>