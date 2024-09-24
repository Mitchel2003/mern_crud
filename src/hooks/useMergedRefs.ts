import { useCallback } from 'react';
import { MutableRefObject, LegacyRef } from 'react';

type MutableRef<T> = MutableRefObject<T> | LegacyRef<T>

const useMergedRefs = <T>(...refs: Array<MutableRef<T>>) => {
  return useCallback((e: T) => {// e corresponde al elemento que se le pasa al hook
    refs.forEach((ref) => {
      if (typeof ref === 'function') { ref(e) }
      else if (ref !== null) { (ref as React.MutableRefObject<T | null>).current = e }
    })
  }, refs)
}

export default useMergedRefs

{/*
  import { useCallback } from 'react';

function useMergedRefs<T = any>(...refs: Array<React.MutableRefObject<T> | React.LegacyRef<T>>) {
  return useCallback((element: T) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = element;
      }
    });
  }, refs);
}

// ... dentro del componente
const mergedRefs = useMergedRefs(fileInputRef, field.ref);

// ... en el JSX
<input
  ref={mergedRefs}
  // ... otros props
/>
   */}