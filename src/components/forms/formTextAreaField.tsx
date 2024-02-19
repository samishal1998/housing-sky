import {twMerge} from "tailwind-merge";
import {type ChangeEventHandler} from "react";
import {useField} from "formik";

export const FormField = ({
	required,
	label,
	name,
	error,
	inputProps,
	value,
	onChange,
	rows,cols
}: {
	required?: boolean;
	label: string;
	name: string;
	error?: string;
	inputProps?: any;
	rows?: number;
	cols?: number;
	onChange?:  ChangeEventHandler<HTMLTextAreaElement> | undefined;
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
				<textarea
					id={name}
					name={name}
					required={required}
					onChange={onChange}
					rows={rows}
					cols={cols}
					value={value}
					{...inputProps}
					className={twMerge("px-3 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:leading-6 outline-0", error && "focus:ring-red-600 ring-red-300")}
				/>
				<div className={'pl-2 text-red-500'}>
					{error}
				</div>
			</div>

		</div>
	);
};

export const FormikTextAreaField = ({
	label,
	...props

}: {
	label: string;
	name:string;
} & React.ComponentProps<'textarea'>) => {
	const [field, meta] = useField(props);
	return (
		<FormField label={label} {...field} {...props} error={meta.error}/>
	);
};
