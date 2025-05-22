import { useState, useCallback, ChangeEvent, FormEvent } from 'react';

export function useForm<T extends Record<string, any>>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = useCallback(
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const target = e.target;
      const name = target.name;

      const fieldValue =
        target instanceof HTMLInputElement && target.type === 'checkbox'
          ? target.checked
          : target.value;

      setValues((prev) => ({
        ...prev,
        [name]: fieldValue
      }));
    },
    []
  );

  const handleSubmit = useCallback(
    (e: FormEvent, onSubmit: (vals: T) => void) => {
      e.preventDefault();
      onSubmit(values);
    },
    [values]
  );

  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    handleSubmit,
    resetForm,
    setValues
  };
}
