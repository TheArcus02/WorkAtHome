import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { errorsInterface } from "../utils/interfaces";
import { isValidHttpUrl, isValidSocialLink, validateEmail } from "../utils/utils";


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
    maxSalary: 'Maximum Salary',
    minSalary: 'Minimum Salary',
    loginEmail: "Email",
    loginPassword: "Password",
  };
  const socials: readonly string[] = [
    'facebook',
    'instagram',
    'twitter',
    'youtube',
  ]
  const checkForUrl: readonly string[] = [
    ...socials,
    'photoUrl',
    'websiteUrl',
    'website',
  ]

  // This fields lenght is not being checked
  const skipInputs: readonly string[] = [
      ...checkForUrl,
      'photoUrl',
  ];
  
  const dontTost: readonly string[] = [
    "loginEmail",
    "loginPassword",
  ]

  useEffect(() => {
    if(inputErrors){
      Object.entries(inputErrors)
      .filter((f) => !dontTost.includes(f[0]) && f[1].error === true)
      .map((field) => toast.warning(field[1].text));
    }
  }, [inputErrors]);

  const validateData = (data: object) => {
    setInputErrors(Object.keys(data).reduce((a,v) => ({...a, [v]: {errors: false, text: ''}}), {}));
    setValidated(false);
    setErrors(false);


    Object.entries(data).forEach((field) => {
      let fieldName = field[0];
      let fieldVal = field[1];

      // if's for fields without lenght checking
      if(checkForUrl.includes(fieldName) && fieldVal.length > 0) {
        if(!isValidHttpUrl(fieldVal)){
          setInputErrors((prev) => ({
            ...prev,
            [fieldName]: {
              error: true,
              text: 'Enter valid website url like: https://www.google.com/',
            },
          }));
          setErrors(true);
        } else if(socials.includes(fieldName)){
          if(!isValidSocialLink(fieldName, fieldVal)){
            setInputErrors((prev) => ({
              ...prev,
              [fieldName]: {
                error: true,
                text: `Looks like your ${fieldName} link is not correct.`,
              },
            }));
            setErrors(true);
          }
        }
      }

      if (skipInputs.includes(fieldName)) return;
      
      if (!fieldVal || fieldVal.length === 0) {
        setInputErrors((prev) => ({
          ...prev,
          [fieldName]: {
            error: true,
            text: `Enter ${
              mappedNames[fieldName] ? mappedNames[fieldName] : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
            }`,
          },
        }));
        setErrors(true);
      }
      // if's for fields with lenght checking
      if (fieldName === "email") {
        if (!validateEmail(fieldVal)) {
          setInputErrors((prev) => ({
            ...prev,
            [fieldName]: { error: true, text: "Enter valid email address" },
          }));
          setErrors(true);
        }
      }
      if(fieldName === "password" || fieldName === "loginPassword"){
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

  return { validateData, inputErrors, errors, validated, setValidated };
};
