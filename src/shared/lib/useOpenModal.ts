import { useState } from "react"

const useOpenModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = () => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`
    )
    document.documentElement.classList.add("modal-open")
    setIsOpen(true)
  }

  const handleCloseModal = () => {
    document.documentElement.classList.remove("modal-open")
    setIsOpen(false)
  }

  const toggleModal = () => {
    if (isOpen) {
      handleCloseModal()
    } else {
      handleOpenModal()
    }
  }

  return { isOpen, handleOpenModal, handleCloseModal, toggleModal }
}

export default useOpenModal
