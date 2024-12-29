import { ChangeEvent, useState } from "react";

type DynamicInputProps = {
	name: string;
	label: string;
};

export default function DynamicInput({ name, label }: DynamicInputProps) {
	const [fields, setFields] = useState<string[]>([""]);

	const handleFieldChange = (
		index: number,
		event: ChangeEvent<HTMLInputElement>,
	) => {
		const newFields = [...fields];
		newFields[index] = event.target.value;
		setFields(newFields);
	};

	const addField = () => {
		if (fields[fields.length - 1].trim() !== "") {
			setFields([...fields, ""]);
		} else {
			alert("Please fill out the previous field before adding a new one.");
		}
	};

	const removeField = (indexToRemove: number) => {
		if (fields.length > 1) {
			// Ensure we keep at least one field
			setFields(fields.filter((_, index) => index !== indexToRemove));
		}
	};

	return (
		<fieldset>
			<legend>{label}</legend>
			{fields.map((value, index) => (
				<div key={index} role="group">
					<input
						type="text"
						name={name}
						value={value}
						onChange={(e) => handleFieldChange(index, e)}
						required={index === 0}
						data-index={index}
					/>
					{index > 0 && (
						<button type="button" onClick={() => removeField(index)}>
							Remove
						</button>
					)}
				</div>
			))}
			<button type="button" onClick={addField}>
				Add {label}
			</button>
		</fieldset>
	);
}
