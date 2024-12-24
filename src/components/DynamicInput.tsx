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

	return (
		<fieldset>
			<legend>{label}</legend>
			{fields.map((value, index) => (
				<div key={index}>
					<input
						type="text"
						// Change the name to use array syntax
						name={name}
						value={value}
						onChange={(e) => handleFieldChange(index, e)}
						required={index === 0}
						// Add data-index to track position
						data-index={index}
					/>
				</div>
			))}
			<button type="button" onClick={addField}>
				Add {label}
			</button>
		</fieldset>
	);
}
