import { motion } from "framer-motion"
import { Logo, Spinner } from "@/shared/ui"
import "./WebLoaderIndicator.scss"

const WebLoaderIndicator = () => {
  return (
    <motion.div
      className={"web-loader-indicator"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="web-loader-indicator__body">
        <Logo
          isTitle={true}
          className={"web-loader-indicator__logo"}
        />
        <Spinner className={"web-loader-indicator__spinner"} />
      </div>
    </motion.div>
  )
}

export default WebLoaderIndicator
