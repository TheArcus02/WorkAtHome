import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { errorsInterface } from "../utils/interfaces";
import { validateEmail } from "../utils/utils";


export const useValidateInputs = () => {
  const [inputErrors, setInputErrors] =
    useState<errorsInterface>();
  const [errors, setErrors] = useState<Boolean>(false);
  const [validated, setValidated] = useState(false);

  interface mappedNamesInterface {
    [key: string]: string;
  }

  const mappedNames: mappedNamesInterface = {
    firstName: 'First Name',
    lastName: 'Last Name',
  };

  const skipInputs: string[] = [
      
  ];

  useEffect(() => {
    if(inputErrors){
      Object.values(inputErrors)
      .filter((f) => f.error === true)
      .map((field) => toast.warning(field.text));
    }
  }, [inputErrors]);

  const validateData = (data: object) => {
    setInputErrors(Object.keys(data).reduce((a,v) => ({...a, [v]: {errors: false, text: ''}}), {}));
    setValidated(false);
    setErrors(false);


    Object.entries(data).forEach((field) => {
      let fieldName = field[0];
      let fieldVal = field[1];

      if (skipInputs.includes(fieldName)) return;

      if (!fieldVal || fieldVal.length === 0) {
        setInputErrors((prev) => ({
          ...prev,
          [fieldName]: {
            error: true,
            text: `Enter ${
              mappedNames[fieldName] ? mappedNames[fieldName] : fieldName
            }`,
          },
        }));
        setErrors(true);
      }
      if (fieldName === "email") {
        if (!validateEmail(fieldVal)) {
          setInputErrors((prev) => ({
            ...prev,
            [fieldName]: { error: true, text: "Enter valid email address" },
          }));
          setErrors(true);
        }
      }
      if(fieldName === "password"){
        if(fieldVal.length < 6){
          setInputErrors((prev) => ({
            ...prev,
            [fieldName]: { error: true, text: "Password must have at least 6 characters" },
          }));
          setErrors(true);
        }
      }
    });
    setValidated(true);
  };

  return { validateData, inputErrors, errors, validated };
};
