<script setup>
import { ref, onMounted } from 'vue'
import { useHead } from '@vueuse/head'
import { useClipboard } from '@vueuse/core'
import { authApi } from '@/features/auth/api'
import { useAuth } from '@/features/auth/composables/useAuth'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/shared/components/ui/alert-dialog'
import { toast } from 'vue-sonner'
import { Copy, Check } from 'lucide-vue-next'
import SettingsLayout from '../components/SettingsLayout.vue'

// Auth state
const { user } = useAuth()

// 2FA state
const isLoading = ref(false)
const twoFactorEnabled = ref(false)
const showSetupForm = ref(false)
const showConfirmationForm = ref(false)
const showRegeneratedCodes = ref(false)
const qrCode = ref('')
const secretKey = ref('')
const recoveryCodes = ref([])
const confirmationCode = ref('')
const error = ref('')

// Clipboard functionality
const { copy, copied, isSupported: clipboardSupported } = useClipboard()

// Copy functionality
const copyToClipboard = (text, itemName) => {
  if (clipboardSupported.value) {
    copy(text)
    toast.success(`${itemName} copied to clipboard!`)
  } else {
    toast.error('Clipboard not supported')
  }
}

const copyRecoveryCodes = () => {
  // Add defensive check to prevent undefined errors
  if (!recoveryCodes.value || !Array.isArray(recoveryCodes.value) || recoveryCodes.value.length === 0) {
    toast.error('No recovery codes available to copy')
    return
  }
  
  const codesText = recoveryCodes.value.join('\n')
  copyToClipboard(codesText, 'Recovery codes')
}

// Check current 2FA status
const checkTwoFactorStatus = () => {
  twoFactorEnabled.value = user.value?.two_factor_enabled === true
}

// Enable 2FA - this will trigger password confirmation automatically
const enableTwoFactor = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authApi.twoFactor.enable()
    
    // Get QR code and secret key for setup
    const [qrResponse, secretResponse] = await Promise.all([
      authApi.twoFactor.getQrCode(),
      authApi.twoFactor.getSecretKey()
    ])
    
    qrCode.value = qrResponse.svg
    secretKey.value = secretResponse.secretKey
    showSetupForm.value = true
    
    toast.success('2FA enabled! Please scan the QR code with your authenticator app.')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to enable 2FA'
    toast.error('Failed to enable 2FA')
  } finally {
    isLoading.value = false
  }
}

// Confirm 2FA setup
const confirmTwoFactor = async () => {
  if (!confirmationCode.value.trim()) {
    error.value = 'Please enter the confirmation code'
    return
  }
  
  isLoading.value = true
  error.value = ''
  
  try {
    await authApi.twoFactor.confirm(confirmationCode.value)
    
    // Get recovery codes
    const recoveryResponse = await authApi.twoFactor.getRecoveryCodes()
    
    // Laravel Fortify returns recovery codes directly as an array
    recoveryCodes.value = Array.isArray(recoveryResponse) ? recoveryResponse : (recoveryResponse.recoveryCodes || recoveryResponse || [])
    
    showSetupForm.value = false
    showConfirmationForm.value = true
    twoFactorEnabled.value = true
    confirmationCode.value = ''
    
    toast.success('2FA setup completed successfully!')
  } catch (err) {
    error.value = err.response?.data?.message || 'Invalid confirmation code'
    toast.error('Failed to confirm 2FA setup')
  } finally {
    isLoading.value = false
  }
}

// Disable 2FA - this will trigger password confirmation automatically
const disableTwoFactor = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    await authApi.twoFactor.disable()
    
    twoFactorEnabled.value = false
    showSetupForm.value = false
    showConfirmationForm.value = false
    showRegeneratedCodes.value = false
    qrCode.value = ''
    secretKey.value = ''
    recoveryCodes.value = []
    
    toast.success('2FA disabled successfully')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to disable 2FA'
    toast.error('Failed to disable 2FA')
  } finally {
    isLoading.value = false
  }
}

// Regenerate recovery codes
const regenerateRecoveryCodes = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await authApi.twoFactor.regenerateRecoveryCodes()
    
    // Laravel Fortify returns recovery codes directly as an array
    recoveryCodes.value = Array.isArray(response) ? response : (response.recoveryCodes || response || [])
    
    // Show the regenerated codes to the user
    showRegeneratedCodes.value = true
    
    toast.success('Recovery codes regenerated successfully')
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to regenerate recovery codes'
    toast.error('Failed to regenerate recovery codes')
  } finally {
    isLoading.value = false
  }
}

// Cancel setup
const cancelSetup = async () => {
  try {
    await authApi.twoFactor.disable()
  } catch (err) {
    // Ignore errors when canceling
  }
  
  showSetupForm.value = false
  showConfirmationForm.value = false
  showRegeneratedCodes.value = false
  qrCode.value = ''
  secretKey.value = ''
  confirmationCode.value = ''
  error.value = ''
}

// Initialize
onMounted(() => {
  checkTwoFactorStatus()
})

// SEO meta data for 2FA settings page
useHead({
  title: '2FA Settings - Laravel App',
  meta: [
    { name: 'description', content: 'Configure two-factor authentication for enhanced security.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: '2FA Settings - Laravel App' },
    { property: 'og:description', content: 'Secure your account with two-factor authentication.' },
  ]
})
</script>

<template>
  <SettingsLayout>
    <div class="space-y-6">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">Two-Factor Authentication</h2>
        <p class="text-muted-foreground">
          Add an extra layer of security to your account with two-factor authentication.
        </p>
      </div>

      <!-- Error Alert -->
      <Alert v-if="error" variant="destructive">
        <AlertDescription>{{ error }}</AlertDescription>
      </Alert>

      <!-- 2FA Status Card -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <div>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                {{ twoFactorEnabled ? 'Your account is protected with 2FA' : 'Secure your account with an authenticator app' }}
              </CardDescription>
            </div>
            <Badge :variant="twoFactorEnabled ? 'default' : 'secondary'">
              {{ twoFactorEnabled ? 'Enabled' : 'Disabled' }}
            </Badge>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Not enabled state -->
          <div v-if="!twoFactorEnabled && !showSetupForm">
            <p class="text-sm text-muted-foreground mb-4">
              Two-factor authentication adds an extra layer of security to your account. 
              You'll need an authenticator app like Google Authenticator or Authy.
            </p>
            <Button 
              @click="enableTwoFactor"
              :disabled="isLoading"
            >
              {{ isLoading ? 'Enabling...' : 'Enable Two-Factor Authentication' }}
            </Button>
          </div>

          <!-- Setup form (QR Code) -->
          <div v-else-if="showSetupForm" class="space-y-6">
            <div>
              <div class="flex items-center gap-2 mb-3">
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">1</div>
                  <span class="text-sm font-medium">Setup Authenticator</span>
                </div>
                <div class="flex-1 h-px bg-muted mx-2"></div>
                <div class="flex items-center gap-2">
                  <div class="w-6 h-6 bg-muted text-muted-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                  <span class="text-sm text-muted-foreground">Confirm Setup</span>
                </div>
              </div>
              
              <h3 class="text-lg font-medium">Setup Two-Factor Authentication</h3>
              <p class="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app, then enter the code below to confirm.
              </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- QR Code -->
              <div class="space-y-3">
                <Label>QR Code</Label>
                <div class="flex justify-center p-4 border rounded-lg bg-white">
                  <div v-html="qrCode" class="qr-code"></div>
                </div>
              </div>

              <!-- Manual Entry -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <Label>Manual Entry Key</Label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    @click="copyToClipboard(secretKey, 'Secret key')"
                    :disabled="!clipboardSupported"
                    class="flex items-center gap-2"
                  >
                    <Copy :size="14" />
                    Copy
                  </Button>
                </div>
                <div class="p-3 border rounded-lg bg-muted">
                  <code class="text-sm font-mono">{{ secretKey }}</code>
                </div>
                <p class="text-xs text-muted-foreground">
                  If you can't scan the QR code, enter this key manually in your authenticator app.
                </p>
              </div>
            </div>

            <!-- Confirmation Code Input -->
            <div class="space-y-3">
              <Label for="confirmation-code">Confirmation Code</Label>
              <div class="flex gap-3">
                <Input
                  id="confirmation-code"
                  v-model="confirmationCode"
                  placeholder="Enter 6-digit code from your authenticator app"
                  maxlength="6"
                  class="font-mono"
                />
                <Button 
                  @click="confirmTwoFactor"
                  :disabled="isLoading || !confirmationCode.trim()"
                >
                  {{ isLoading ? 'Confirming...' : 'Confirm' }}
                </Button>
              </div>
            </div>

            <!-- Cancel Setup -->
            <div class="flex justify-end">
              <Button 
                variant="outline" 
                @click="cancelSetup"
                :disabled="isLoading"
              >
                Cancel Setup
              </Button>
            </div>
          </div>

          <!-- Recovery Codes Display -->
          <div v-else-if="showConfirmationForm" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2 mb-3">
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">✓</div>
                    <span class="text-sm text-muted-foreground">Setup Complete</span>
                  </div>
                  <div class="flex-1 h-px bg-muted mx-2"></div>
                  <div class="flex items-center gap-2">
                    <div class="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">2</div>
                    <span class="text-sm font-medium">Save Recovery Codes</span>
                  </div>
                </div>
                
                <h3 class="text-lg font-medium">Recovery Codes</h3>
                <p class="text-sm text-muted-foreground">
                  Save these recovery codes in a secure location. You can use them to access your account if you lose your authenticator device.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                @click="copyRecoveryCodes"
                :disabled="!clipboardSupported || !recoveryCodes.length"
                class="flex items-center gap-2"
              >
                <Copy :size="16" />
                {{ copied ? 'Copied!' : 'Copy All' }}
              </Button>
            </div>

            <div class="grid grid-cols-2 gap-2 p-4 border rounded-lg bg-muted">
              <code 
                v-for="code in (recoveryCodes || [])" 
                :key="code"
                class="text-sm p-2 bg-background rounded border font-mono"
              >
                {{ code }}
              </code>
            </div>

            <Alert>
              <AlertDescription>
                <strong>Important:</strong> Store these codes safely. They won't be shown again.
              </AlertDescription>
            </Alert>

            <div class="flex gap-3">
              <Button @click="showConfirmationForm = false" class="flex-1">
                I've Saved My Recovery Codes
              </Button>
              <Button 
                variant="outline"
                @click="copyRecoveryCodes"
                :disabled="!clipboardSupported || !recoveryCodes.length"
                class="flex items-center gap-2"
              >
                <Copy :size="16" />
                Copy to Clipboard
              </Button>
            </div>
          </div>

          <!-- Regenerated Recovery Codes Display -->
          <div v-else-if="showRegeneratedCodes" class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-lg font-medium">New Recovery Codes</h3>
                <p class="text-sm text-muted-foreground">
                  Here are your new recovery codes. Save these codes in a secure location. Your old recovery codes are no longer valid.
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                @click="copyRecoveryCodes"
                :disabled="!clipboardSupported || !recoveryCodes.length"
                class="flex items-center gap-2"
              >
                <Copy :size="16" />
                {{ copied ? 'Copied!' : 'Copy All' }}
              </Button>
            </div>

                         <div class="grid grid-cols-2 gap-2 p-4 border rounded-lg bg-muted">
               <code 
                 v-for="code in (recoveryCodes || [])" 
                 :key="code"
                 class="text-sm p-2 bg-background rounded border font-mono"
               >
                 {{ code }}
               </code>
             </div>

            <Alert>
              <AlertDescription>
                <strong>Important:</strong> Store these codes safely. They won't be shown again and your previous codes are no longer valid.
              </AlertDescription>
            </Alert>

            <div class="flex gap-3">
              <Button @click="showRegeneratedCodes = false" class="flex-1">
                I've Saved My New Recovery Codes
              </Button>
              <Button 
                variant="outline"
                @click="copyRecoveryCodes"
                :disabled="!clipboardSupported || !recoveryCodes.length"
                class="flex items-center gap-2"
              >
                <Copy :size="16" />
                Copy to Clipboard
              </Button>
            </div>
          </div>

          <!-- Enabled state -->
          <div v-else-if="twoFactorEnabled" class="space-y-4">
            <p class="text-sm text-muted-foreground">
              Two-factor authentication is active on your account. You can disable it or regenerate your recovery codes below.
            </p>
            
            <div class="flex gap-3">
              <Button 
                variant="outline"
                @click="regenerateRecoveryCodes"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Regenerating...' : 'Regenerate Recovery Codes' }}
              </Button>
              
              <!-- Disable 2FA with confirmation dialog -->
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" :disabled="isLoading">
                    {{ isLoading ? 'Disabling...' : 'Disable 2FA' }}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disable Two-Factor Authentication</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to disable two-factor authentication? This will make your account less secure.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction 
                      @click="disableTwoFactor"
                      class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, Disable 2FA
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- Information Card -->
      <Card>
        <CardHeader>
          <CardTitle>About Two-Factor Authentication</CardTitle>
        </CardHeader>
        <CardContent class="space-y-3">
          <div class="space-y-2">
            <h4 class="font-medium">What is 2FA?</h4>
            <p class="text-sm text-muted-foreground">
              Two-factor authentication (2FA) adds an extra layer of security by requiring both your password 
              and a code from your mobile device to sign in.
            </p>
          </div>
          
          <div class="space-y-2">
            <h4 class="font-medium">Supported Apps</h4>
            <p class="text-sm text-muted-foreground">
              Use any TOTP-compatible authenticator app such as Google Authenticator, Authy, 1Password, or Microsoft Authenticator.
            </p>
          </div>
          
          <div class="space-y-2">
            <h4 class="font-medium">Recovery Codes</h4>
            <p class="text-sm text-muted-foreground">
              Recovery codes can be used to access your account if you lose access to your authenticator device. 
              Store them in a secure location.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </SettingsLayout>
</template>

<style scoped>
.qr-code :deep(svg) {
  width: 200px;
  height: 200px;
}
</style> 