import { twMerge } from 'tailwind-merge';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '~/components/ui/select';
import { useField } from 'formik';

export const FormSelectField = ({
	required,
	label,
	placeholder,
	name,
	error,
	value,
	onChange,
	options,
}: {
	required?: boolean;
	label: string;
	placeholder?: string;
	name: string;
	error?: string;
	onChange?: (value: string) => void;
	value?: any;
	options?: { key: string; content: React.ReactNode }[];
}) => {
	return (
		<div>
			<div className="flex items-center justify-between">
				<label
					htmlFor={name}
					className="block text-[1rem] font-semibold leading-6 text-gray-900">
					{label}
				</label>
			</div>

			<div className={'mt-2'}>
				<Select
					key={name}
					name={name}
					required={required}
					value={value}
					onValueChange={onChange}
					>
					<SelectTrigger
					className={twMerge(
						'rounded-md border-0 px-3 py-1.25 text-gray-900 ring-inset shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-[3px] focus:ring-offset-0 focus:ring-primary sm:leading-6',
						error && 'ring-red-300 focus:ring-red-600',
					)}
					>
						<SelectValue placeholder={placeholder} />
					</SelectTrigger>
					<SelectContent>
						{options?.map(({ key, content }) => {
							return (
								<SelectItem key={key} value={key}>
									{content}
								</SelectItem>
							);
						})}
					</SelectContent>
				</Select>
				<div className={'pl-2 text-red-500'}>{error}</div>
			</div>
		</div>
	);
};

export const FormikFormSelectField = ({
	label,
	placeholder,
	options,
	...props
}: {
	label: string;
	name: string;

	required?: boolean;
	placeholder?: string;
	options?: { key: string; content: React.ReactNode }[];
}) => {
	const [field, meta, helpers] = useField({ name: props.name, required: props.required });
	return (
		<FormSelectField
			label={label}
			placeholder={placeholder}
			options={options}

			{...field}
			{...props}
			error={meta.error}
			onChange={(value)=>{
				helpers.setValue(value).catch(()=>true)
				helpers.setTouched(true).catch(()=>true)
			}}
		/>
	);
};
