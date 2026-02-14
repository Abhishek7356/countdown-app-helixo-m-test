import * as Yup from "yup";

export const countdownSchema = Yup.object().shape({
    title: Yup.string().required("Timer name is required"),
    startDate: Yup.string().required("Start date is required"),
    startTime: Yup.string().required("Start time is required"),
    endDate: Yup.string().required("End date is required"),
    endTime: Yup.string().required("End time is required"),
    description: Yup.string().max(200, "Description too long"),
    bgColor: Yup.string().required("Background color is required"),
    textColor: Yup.string().required("Text color is required"),
});
