'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
}

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <motion.h1 
          className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
          {...fadeInUp}
        >
          Unlock Your Potential with EduPro
        </motion.h1>
        <motion.p 
          className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
          {...fadeInUp}
          transition={{ delay: 0.2 }}
        >
          Access premium courses with time-limited enrollment. Learn from industry experts and boost your skills.
        </motion.p>
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <Button asChild size="lg" className="mr-4">
            <Link href="/courses">Explore Courses</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Get Started</Link>
          </Button>
        </motion.div>
      </section>

      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">About EduPro</h2>
          <p className="text-lg text-muted-foreground mb-8">
            EduPro is a cutting-edge course platform designed for professionals who want to stay ahead in their careers. Our time-limited access model ensures that you are learning the most up-to-date content from industry leaders.
          </p>
          <ul className="text-left space-y-4">
            {[
              'Expert-led courses',
              'Time-limited access for focused learning',
              'Interactive video lessons and comprehensive notes',
              'Industry-recognized certifications',
            ].map((feature, index) => (
              <motion.li 
                key={index}
                className="flex items-center"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </section>

      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6">Contact Us</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Have questions about our courses or need help getting started? Our team is here to assist you.
          </p>
          <Button size="lg">Get in Touch</Button>
        </motion.div>
      </section>
    </div>
  )
}

