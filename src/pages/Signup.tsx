import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import * as yup from "yup";
import { getFullURL } from "../components/utils";
import { axiosInstance, ENDPOINTS } from "../components/constants";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = yup.object({
	username: yup.string().min(3).required(),
	email: yup.string().email().required(),
	password: yup.string().min(6).required(),
})

export default function SignUp() {
	const navigate = useNavigate();

	const formik = useFormik({
		validationSchema,
		initialValues: {
			username: '',
			email: '',
			password: ''
		},
		onSubmit: async (values, helper) => {
			const response = await axiosInstance.post(getFullURL(ENDPOINTS.signup), values);
			toast(response.data.message, {
				type: response.data.status ? 'success' : 'error'
			});

			if (response.data.status) {
				navigate('/login');
			}
			helper.setSubmitting(false);
		}
	})
	return (
		<div className="flex justify-center items-center h-full">
			<div className="flex flex-col w-[420px] bg-white p-4 py-8 rounded-md gap-4">
				<h2 className="font-bold text-3xl text-center">Sign Up</h2>
				<TextField label="Email" required disabled={formik.isSubmitting} value={formik.values.email} name="email" onChange={formik.handleChange} error={formik.touched.email && Boolean(formik.errors.email)} helperText={formik.touched.email && formik.errors.email} inputMode="email" />
				<TextField label="Username" required disabled={formik.isSubmitting} value={formik.values.username} name="username" onChange={formik.handleChange} error={formik.touched.username && Boolean(formik.errors.username)} helperText={formik.touched.username && formik.errors.username} inputMode="text" />
				<TextField label="Password" type="password" required disabled={formik.isSubmitting} value={formik.values.password} name="password" onChange={formik.handleChange} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
				<p className="text-end text-sm">Already have an account? <Link to='/login' className="text-blue-600 font-bold">Login</Link></p>
				<Button variant="contained" disabled={formik.isSubmitting} onClick={() => formik.handleSubmit()}>{
					formik.isSubmitting ? <CircularProgress /> : 'Submit'
				}</Button>
			</div>
		</div>
	)
}