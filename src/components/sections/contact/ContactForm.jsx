import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, AlertCircle } from 'lucide-react';
import { contactSubjects } from '@/data/contact';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { RadioChips } from '@/components/ui/RadioChips';
import { Button } from '@/components/ui/Button';
import { submitContactForm } from '@/services/contact';

export function ContactForm() {
  const [submissionState, setSubmissionState] = useState('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      subject: 'Video Editing',
      message: '',
    },
  });

  const onSubmit = async (data) => {
    setSubmissionState('loading');
    setStatusMessage('');

    try {
      const res = await submitContactForm(data);
      setSubmissionState('success');
      setStatusMessage(res.message || 'Thanks! We will reach out shortly.');
      reset();
      setTimeout(() => {
        setSubmissionState('idle');
        setStatusMessage('');
      }, 5000);
    } catch (err) {
      console.error(err);
      setSubmissionState('error');
      setStatusMessage('Something went wrong. Please try again or email us.');
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="p-4 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="First Name"
            placeholder="John"
            {...register('firstName', {
              required: 'First name is required',
            })}
            error={errors.firstName?.message}
          />

          <Input
            label="Last Name"
            placeholder="Doe"
            {...register('lastName', {
              required: 'Last name is required',
            })}
            error={errors.lastName?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address format',
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 000-0000"
            {...register('phone', {
              required: 'Phone number is required',
              minLength: {
                value: 6,
                message: 'Please enter a valid phone number',
              },
            })}
            error={errors.phone?.message}
          />
        </div>
        <Controller
          name="subject"
          control={control}
          render={({ field }) => (
            <RadioChips
              label="Select Subject"
              options={contactSubjects}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        <Textarea
          label="Message"
          rows={5}
          placeholder="Describe your project..."
          {...register('message', {
            required: 'Please share a brief message about your project',
            minLength: {
              value: 10,
              message: 'Message should be at least 10 characters long',
            },
          })}
          error={errors.message?.message}
        />
      </div>

      <AnimatePresence>
        {statusMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
              submissionState === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {submissionState === 'success' ? (
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span>{statusMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          variant="outline"
          size="lg"
          disabled={submissionState === 'loading'}
          className="px-8 border-ink/80 hover:bg-ink hover:text-white transition-all shadow-xs"
        >
          {submissionState === 'loading' && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {submissionState === 'success' && (
            <Check className="w-4 h-4 text-emerald-600 mr-2 stroke-[3]" />
          )}
          <span>
            {submissionState === 'loading'
              ? 'Sending...'
              : submissionState === 'success'
                ? 'Message Sent!'
                : 'Book a Free Call'}
          </span>
        </Button>
      </div>
    </motion.form>
  );
}

export default ContactForm;
