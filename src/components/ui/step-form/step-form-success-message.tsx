import { RefreshCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "#/ui/button";

const successVariants = {
  hidden: {
    y: 50,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: { ease: "backIn", duration: 0.6 }
  }
}

const SuccessMessage = () => {
  const refresh = () => window.location.reload();
  return (
    <motion.section
      className="w-full h-full flex flex-col items-center justify-center gap-4 md:gap-2 text-center"
      variants={successVariants}
      initial="hidden"
      animate="visible"
    >
      <img
        width="150"
        height="150"
        src={'/assets/success.png'}
        alt="Success Icon"
        className="md:mb-4"
      />
      <h4 className="text-2xl font-semibold text-white md:text-3xl">
        Thank you!
      </h4>
      <p className="text-sm max-w-md text-neutral-300 md:text-base">
        Thanks for confirming your subscription! We hope you have fun using our
        plataform. If you ever need support, please feel free to email us at
        support@loremgaming.com
      </p>
      <div className="flex items-center mt-6">
        <div className="relative after:pointer-events-none after:absolute after:inset-px after:rounded-[11px] after:shadow-highlight after:shadow-white/10 focus-within:after:shadow-[#77f6aa] after:transition">
          <Button
            onClick={refresh}
            className="relative text-neutral-200 bg-neutral-900 border border-black/20 shadow-black/10 rounded-xl hover:text-white"
          >
            <RefreshCcw className="mr-2 h-4 w-4" /> Restart
          </Button>
        </div>
      </div>
    </motion.section>
  )
}

export default SuccessMessage
