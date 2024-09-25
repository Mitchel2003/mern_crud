import { LegacyRef, MutableRefObject, useCallback } from 'react';

const useMergedRefs = <T = any>(...refs: Array<MutableRefObject<T> | LegacyRef<T>>) => {
  return useCallback((element: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') ref(element)
      else if (ref !== null) (ref as MutableRefObject<T | null>).current = element
    })
  }, refs)
}

export default useMergedRefs

// // ... dentro del componente
// const mergedRefs = useMergedRefs(fileInputRef, field.ref);

// // ... en el JSX
// <input
//   ref={mergedRefs}
//   // ... otros props
// />