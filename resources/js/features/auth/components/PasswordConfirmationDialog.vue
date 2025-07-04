<script setup>
import { ref, onMounted } from 'vue'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Label } from '@/shared/components/ui/label'
import { Alert, AlertDescription } from '@/shared/components/ui/alert'
import { usePasswordConfirmation } from '../composables/usePasswordConfirmation'

// Get password confirmation state and actions from composable
const { 
  isDialogOpen, 
  isLoading, 
  error, 
  confirmPassword, 
  cancelConfirmation,
  registerPasswordClearCallback
} = usePasswordConfirmation()

const password = ref('')

// Register password clearing callback when component mounts
onMounted(() => {
  registerPasswordClearCallback(() => {
    password.value = ''
  })
})

const handleSubmit = () => {
  if (!password.value.trim()) {
    return
  }
  
  confirmPassword(password.value)
}

const handleCancel = () => {
  cancelConfirmation()
}

const handleOpenChange = (open) => {
  if (!open) {
    handleCancel()
  }
}
</script>

<template>
  <Dialog :open="isDialogOpen" @update:open="handleOpenChange">
    <DialogContent class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Confirm Your Password</DialogTitle>
        <DialogDescription>
          Please confirm your password to continue with this action.
        </DialogDescription>
      </DialogHeader>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <Label for="password">Current Password</Label>
          <Input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your current password"
            autocomplete="new-password"
            :disabled="isLoading"
            required
            autofocus
          />
        </div>
        
        <Alert v-if="error" variant="destructive">
          <AlertDescription>{{ error }}</AlertDescription>
        </Alert>
        
        <div class="flex justify-end gap-3">
          <Button 
            type="button" 
            variant="outline" 
            @click="handleCancel"
            :disabled="isLoading"
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            :disabled="isLoading || !password.trim()"
          >
            {{ isLoading ? 'Confirming...' : 'Confirm' }}
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template> 