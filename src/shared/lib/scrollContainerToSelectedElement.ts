const scrollContainerToSelectedElement = (
  element: HTMLElement,
  selectedHTMLId: string | undefined,
  direction: "horizontal" | "vertical",
  offset: number | undefined = 20,
  scrollBehavior: ScrollBehavior = "smooth"
) => {
  if (selectedHTMLId !== undefined) {
    const profileElement = document.getElementById(selectedHTMLId)
    if (profileElement !== null) {
      switch (direction) {
        case "horizontal": {
          const offsetLeft = profileElement.offsetLeft
          console.log(offsetLeft)

          element.scrollTo({
            left: offsetLeft - offset,
            behavior: scrollBehavior,
          })
          return
        }
        case "vertical": {
          const offsetTop = profileElement.offsetTop
          element.scrollTo({
            top: offsetTop - offset,
            behavior: scrollBehavior,
          })
          return
        }
      }
    }
  }
}

export default scrollContainerToSelectedElement
