import { useState } from 'react'

/** @description permite crear un formulario de pasos */
export function useStepForm(steps: number) {
	const [showMessage, setShowMessage] = useState(false)
	const [index, setIndex] = useState(0)

	const goTo = (index: number) => setIndex(index)

	const next = () => {
		if (index < steps - 1) setIndex((i) => i + 1)
		else if (index === steps - 1) setShowMessage(true)
	}

	const previous = () => {
		if (index > 0) setIndex((i) => i - 1)
	}

	return {
		index,
		goTo,
		next,
		previous,
		showMessage,
		isFirstStep: index === 0,
		isLastStep: index === steps - 1,
	}
}