import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Send, Mail, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PERSONAL_INFO, EMAILJS_CONFIG } from "@/constants";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("idle");
  const [toast, setToast] = useState(null);

  function handleChange(e) {
    const field = e.target.name;
    const value = e.target.value;
    setFormData(function (prev) {
      return Object.assign({}, prev, { [field]: value });
    });
  }

  function showToast(type, message) {
    setToast({ type: type, message: message });
    setTimeout(function () {
      setToast(null);
    }, 4000);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showToast("error", "Merci de remplir tous les champs.");
      return;
    }

    setStatus("loading");

    try {
      await emailjs.send(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        EMAILJS_CONFIG.publicKey
      );

      setStatus("success");
      showToast("success", "Message envoye avec succes ! Je vous repondrai rapidement.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus("error");
      showToast("error", "Une erreur est survenue. Merci de reessayer ou de m'ecrire directement par email.");
    }

    setTimeout(function () {
      setStatus("idle");
    }, 2000);
  }

  return (
    <section id="contact" className="section-container">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-14"
      >
        <p className="text-accent font-mono text-sm mb-2 tracking-wider">08. Contact</p>
        <h2 className="text-3xl sm:text-4xl font-bold gradient-text">Travaillons ensemble</h2>
        <p className="text-muted mt-3 max-w-xl mx-auto">
          Une question, une opportunite, ou juste envie d'echanger ? N'hesitez pas a me contacter.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-5 gap-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center text-primary-light">
                <Mail size={18} />
              </div>
              <p className="font-semibold text-white text-sm">Email</p>
            </div>
            <p className="text-sm text-muted">{PERSONAL_INFO.email}</p>
          </div>

          <div className="bento-card">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent">
                <MapPin size={18} />
              </div>
              <p className="font-semibold text-white text-sm">Localisation</p>
            </div>
            <p className="text-sm text-muted">{PERSONAL_INFO.location}</p>
          </div>

          <div className="bento-card">
            <p className="font-semibold text-white text-sm mb-3">Retrouvez-moi aussi sur</p>
            <div className="flex gap-3">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full"
              >
                <FaGithub size={18} />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="glass glass-hover w-10 h-10 flex items-center justify-center rounded-full"
              >
                <FaLinkedin size={18} />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-3 bento-card space-y-4"
        >
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Votre nom"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="votre@email.com"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Sujet de votre message"
            />
          </div>

          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Ecrivez votre message ici..."
              className="min-h-[140px]"
            />
          </div>

          <Button type="submit" variant="default" size="lg" className="w-full" disabled={status === "loading"}>
            <Send size={18} />
            {status === "loading" ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </motion.form>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-8 left-1/2 z-50 flex items-center gap-3 px-5 py-4 rounded-xl bg-[#08080d] border border-white/10 shadow-xl max-w-md"
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
            ) : (
              <XCircle size={20} className="text-red-400 shrink-0" />
            )}
            <p className="text-sm text-white/90">{toast.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}