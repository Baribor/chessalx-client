import { Button, CircularProgress, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { axiosInstance, ENDPOINTS } from "../components/constants";
import { getFullURL } from "../components/utils";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";
import { userState } from "../components/store/userState";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const validationSchema = yup.object({
	identifier: yup.string().required('username or email required.'),
	password: yup.string().required(),
})

export default function Login() {
	const setUser = useSetRecoilState(userState);
	const navigate = useNavigate();
	const [params] = useSearchParams();

	const formik = useFormik({
		validationSchema,
		initialValues: {
			identifier: '',
			password: ''
		},
		onSubmit: async (values, helper) => {
			const response = await axiosInstance.post(getFullURL(ENDPOINTS.login), values);
			toast(response.data.message, {
				type: response.data.status ? 'success' : 'error'
			});

			if (response.data.status) {
				localStorage.setItem('token', response.data.data.token);
				setUser(response.data.data);

				if (params.get('next')) {
					navigate(params.get('next')!, {
						replace: true
					})
				} else {
					navigate("/");
				}
			}
			helper.setSubmitting(false);
		}
	})
	return (
		<div className="flex justify-center items-center h-full">
			<div className="flex flex-col w-[420px] bg-white p-4 py-8 rounded-md gap-4">
				<h2 className="font-bold text-3xl text-center">LOGIN</h2>
				<TextField label="Username or Email" required disabled={formik.isSubmitting} value={formik.values.identifier} name="identifier" onChange={formik.handleChange} error={formik.touched.identifier && Boolean(formik.errors.identifier)} helperText={formik.touched.identifier && formik.errors.identifier} />
				<TextField label="Password" type="password" required disabled={formik.isSubmitting} value={formik.values.password} name="password" onChange={formik.handleChange} error={formik.touched.password && Boolean(formik.errors.password)} helperText={formik.touched.password && formik.errors.password} />
				<p className="text-end text-sm">Don't have an account? <Link to='/signup' className="text-blue-600 font-bold">Sign up</Link></p>
				<Button variant="contained" disabled={formik.isSubmitting} onClick={() => formik.handleSubmit()}>{
					formik.isSubmitting ? <CircularProgress /> : 'Submit'
				}</Button>
			</div>
		</div>
	)
}