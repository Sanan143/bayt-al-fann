import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2 } from "lucide-react";

const commissionSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  style: z.string().min(1, "Please select a style"),
  size: z.string().min(1, "Please specify a rough size"),
  budget: z.string().min(1, "Please select a budget range"),
  description: z.string().min(10, "Please provide more details about your vision"),
});

type CommissionFormValues = z.infer<typeof commissionSchema>;

export default function Commission() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<CommissionFormValues>({
    resolver: zodResolver(commissionSchema),
    defaultValues: {
      name: "",
      email: "",
      style: "",
      size: "",
      budget: "",
      description: "",
    },
  });

  function onSubmit(data: CommissionFormValues) {
    console.log(data);
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-heading text-5xl md:text-6xl mb-6">Commission an Artwork</h1>
          <p className="font-body font-light text-muted-foreground max-w-2xl mx-auto text-lg">
            Collaborate with Tasmiya to create a bespoke piece tailored to your space and vision.
          </p>
        </motion.div>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-card-border p-12 text-center flex flex-col items-center"
          >
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 text-primary">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-heading text-3xl mb-4">Request Received</h2>
            <p className="font-body text-muted-foreground mb-8 max-w-md">
              Thank you for your interest. Tasmiya reviews all commissions personally and will be in touch within 3-5 business days to discuss your vision.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              variant="outline" 
              className="rounded-none font-heading uppercase text-xs tracking-widest border-primary text-primary"
            >
              Submit Another
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 md:p-12 border border-card-border">
                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-lg">Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Jane Doe" {...field} className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-lg">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jane@example.com" {...field} className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-lg">Preferred Style</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-border bg-transparent h-12">
                              <SelectValue placeholder="Select a style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="abstract">Abstract Minimalist</SelectItem>
                            <SelectItem value="islamic">Islamic Geometry</SelectItem>
                            <SelectItem value="calligraphy">Arabic Calligraphy</SelectItem>
                            <SelectItem value="portrait">Expressive Portrait</SelectItem>
                            <SelectItem value="mixed">Mixed / Unsure</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-heading text-lg">Estimated Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="rounded-none border-border bg-transparent h-12">
                              <SelectValue placeholder="Select a range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="small">$500 - $1,000</SelectItem>
                            <SelectItem value="medium">$1,000 - $3,000</SelectItem>
                            <SelectItem value="large">$3,000 - $5,000</SelectItem>
                            <SelectItem value="premium">$5,000+</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-lg">Approximate Dimensions</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 100x120cm or Large Living Room wall" {...field} className="rounded-none border-border bg-transparent focus-visible:ring-primary h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-heading text-lg">Your Vision</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the colors, feelings, or specific inspirations you have in mind..." 
                          {...field} 
                          className="rounded-none border-border bg-transparent focus-visible:ring-primary min-h-[150px]" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-14 rounded-none font-heading text-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  Submit Inquiry
                </Button>
              </form>
            </Form>
          </motion.div>
        )}
      </div>
    </div>
  );
}
