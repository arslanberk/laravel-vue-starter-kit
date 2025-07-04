<script setup>
import { Shield, Mail, Lock, Eye, CheckCircle, AlertTriangle, Clock, RefreshCw, Smartphone } from 'lucide-vue-next'

const props = defineProps({
  type: {
    type: String,
    default: 'login', // 'login', 'register', 'forgot-password', 'email-verification', 'password-reset', 'two-factor'
  }
})

const loginTips = [
  {
    icon: Shield,
    title: 'Secure Sign In',
    description: 'Your login credentials are encrypted and protected with industry-standard security measures.'
  },
  {
    icon: Eye,
    title: 'Password Visibility',
    description: 'Use the eye icon to toggle password visibility. This helps ensure you enter your password correctly.'
  },
  {
    icon: CheckCircle,
    title: 'Stay Signed In',
    description: 'We\'ll keep you signed in securely across browser sessions for your convenience.'
  },
  {
    icon: AlertTriangle,
    title: 'Account Security',
    description: 'If you suspect unauthorized access, change your password immediately and contact support.'
  }
]

const registerTips = [
  {
    icon: Lock,
    title: 'Strong Password Required',
    description: 'Create a password with at least 8 characters, including letters, numbers, and special characters.'
  },
  {
    icon: Mail,
    title: 'Email Verification',
    description: 'You\'ll receive a verification email after registration. Check your inbox and spam folder.'
  },
  {
    icon: Shield,
    title: 'Data Protection',
    description: 'Your personal information is encrypted and never shared with third parties.'
  },
  {
    icon: CheckCircle,
    title: 'Account Benefits',
    description: 'Access advanced features, analytics, and personalized dashboard.'
  }
]

const forgotPasswordTips = [
  {
    icon: Mail,
    title: 'Check Your Email',
    description: 'Password reset instructions will be sent to your registered email address within a few minutes.'
  },
  {
    icon: Clock,
    title: 'Link Expires Soon',
    description: 'Reset links expire after 1 hour for security. If it expires, you can request a new one.'
  },
  {
    icon: Shield,
    title: 'Secure Process',
    description: 'Our password reset process is secure and protects your account from unauthorized access.'
  },
  {
    icon: AlertTriangle,
    title: 'Check Spam Folder',
    description: 'If you don\'t see the email, check your spam or junk folder. Add us to your contacts.'
  }
]

const emailVerificationTips = [
  {
    icon: Mail,
    title: 'Verification Required',
    description: 'Please verify your email address to access all features and secure your account.'
  },
  {
    icon: CheckCircle,
    title: 'One-Time Process',
    description: 'Email verification is required only once. Click the link in your email to complete verification.'
  },
  {
    icon: RefreshCw,
    title: 'Didn\'t Receive Email?',
    description: 'You can request a new verification email if you didn\'t receive it or if it expired.'
  },
  {
    icon: Shield,
    title: 'Account Security',
    description: 'Email verification helps protect your account and ensures you receive important notifications.'
  }
]

const passwordResetTips = [
  {
    icon: Lock,
    title: 'Choose Strong Password',
    description: 'Create a new password with at least 8 characters, including letters, numbers, and symbols.'
  },
  {
    icon: Shield,
    title: 'Password Security',
    description: 'Avoid using the same password for multiple accounts. Use a unique, strong password.'
  },
  {
    icon: CheckCircle,
    title: 'Immediate Access',
    description: 'Once reset, you can immediately sign in with your new password.'
  },
  {
    icon: AlertTriangle,
    title: 'Keep It Safe',
    description: 'Store your password securely and never share it with anyone. Consider using a password manager.'
  }
]

const twoFactorTips = [
  {
    icon: Smartphone,
    title: 'Authenticator App Required',
    description: 'Open your authenticator app (Google Authenticator, Authy, etc.) to get the 6-digit verification code.'
  },
  {
    icon: Clock,
    title: 'Time-Based Codes',
    description: 'Codes refresh every 30 seconds and are only valid for a short time. Use the most recent code displayed.'
  },
  {
    icon: CheckCircle,
    title: 'Auto-Submit Feature',
    description: 'The form automatically submits when you enter all 6 digits. If it doesn\'t work, use the submit button.'
  },
  {
    icon: Shield,
    title: 'Enhanced Security',
    description: 'Two-factor authentication significantly increases your account security by requiring a second verification step.'
  }
]

const getTips = () => {
  switch (props.type) {
    case 'register':
      return registerTips
    case 'forgot-password':
      return forgotPasswordTips
    case 'email-verification':
      return emailVerificationTips
    case 'password-reset':
      return passwordResetTips
    case 'two-factor':
      return twoFactorTips
    default:
      return loginTips
  }
}

const getHeader = () => {
  switch (props.type) {
    case 'register':
      return 'Getting Started'
    case 'forgot-password':
      return 'Password Reset'
    case 'email-verification':
      return 'Email Verification'
    case 'password-reset':
      return 'New Password'
    case 'two-factor':
      return 'Secure Authentication'
    default:
      return 'Welcome Back'
  }
}

const getDescription = () => {
  switch (props.type) {
    case 'register':
      return 'Everything you need to know about creating your account'
    case 'forgot-password':
      return 'Important information about resetting your password'
    case 'email-verification':
      return 'Steps to verify your email address and secure your account'
    case 'password-reset':
      return 'Guidelines for creating a secure new password'
    case 'two-factor':
      return 'Complete your sign in with two-factor authentication'
    default:
      return 'Tips for a secure and smooth sign-in experience'
  }
}

const currentTips = getTips()
</script>

<template>
  <div class="flex flex-col h-full justify-center p-8">
    <div class="mx-auto space-y-8">
      <!-- Header -->
      <div class="space-y-2">
        <h2 class="text-2xl font-bold tracking-tight">
          {{ getHeader() }}
        </h2>
        <p class="text-muted-foreground">
          {{ getDescription() }}
        </p>
      </div>
      
      <!-- Tips List -->
      <div class="space-y-6">
        <div
          v-for="(tip, index) in currentTips"
          :key="index"
          class="flex items-start space-x-3"
        >
          <div class="flex-shrink-0 mt-1">
            <div class="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
              <component 
                :is="tip.icon" 
                class="h-4 w-4 text-primary" 
              />
            </div>
          </div>
          <div class="space-y-1">
            <h3 class="font-medium text-sm">{{ tip.title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              {{ tip.description }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Footer Note -->
      <div class="border-t pt-6">
        <div class="flex items-center space-x-2">
          <Shield class="h-4 w-4 text-muted-foreground" />
          <p class="text-xs text-muted-foreground">
            Protected by advanced security measures and SSL encryption
          </p>
        </div>
      </div>
    </div>
  </div>
</template> 