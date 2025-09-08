export default function SelectGender({value = "Male", setValue}: {value: "Male" | "Female", setValue: (data: "Male" | "Female") => void}) {
     const defaultClass: string = "text-center border rounded-lg p-2 text-sm cursor-pointer transition";

     const classSelected = "font-bold ring-2";
     const classDeselected = "hover:outline-2 text-neutral-600";

     const maleClassSelected = classSelected + " text-blue-500 bg-blue-500/20";
     const maleClassDeselected = classDeselected + " outline-blue-500/30 hover:text-blue-500/80";

     const femaleClassSelected = classSelected + " text-pink-500 bg-pink-500/20";
     const femaleClassDeselected = classDeselected + " outline-pink-500/30 hover:text-pink-500/80";

     return (
          <div className="grid gap-2 grid-cols-2">
               <div onClick={() => setValue("Male")} className={`${defaultClass} ${value == "Male" ? maleClassSelected : maleClassDeselected}`}>
                    Male
               </div>
               <div onClick={() => setValue("Female")} className={`${defaultClass} ${value == "Female" ? femaleClassSelected : femaleClassDeselected}`}>
                    Female
               </div>
          </div>
     )
}