import {twMerge} from "tailwind-merge";
import {ChangeEventHandler} from "react";
import {useField} from "formik";

export const FormField = ({
	required,
	label,
	name,
	error,
	inputProps,
	value,
	onChange,
	type
}: {
	required?: boolean;
	label: string;
	name: string;
	type?: HTMLInputElement['type'];
	error?: string;
	inputProps?: any;
	onChange?:  ChangeEventHandler<HTMLInputElement> | undefined;
	value?: any;
}) => {
	return (
		<div>
			<div className="flex items-center justify-between">
				<label htmlFor={name} className="block text-[1rem] font-semibold leading-6 text-gray-900">
					{label}
				</label>
			</div>
			<div className="mt-2">
				<input
					id={name}
					name={name}
					type={type}
					required={required}
					onChange={onChange}
					value={value}
					{...inputProps}
					className={twMerge("px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:leading-6", error && "focus:ring-red-600 ring-red-300")}
				/>
				<div className={'pl-2 text-red-500'}>
					{error}
				</div>
			</div>

		</div>
	);
};

export const FormikFormField = ({
	label,
	...props

}: {
	label: string;
	name:string;
} & React.ComponentProps<'input'>) => {
	const [field, meta, helpers] = useField(props);
	return (
		<FormField label={label} {...field} {...props} error={meta.error}/>
	);
};
