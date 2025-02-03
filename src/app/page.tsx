import Image from "next/image";
import { ThermostatData } from "@/components/thermostat-data";
import { ThermostatEditing } from "@/components/thermostat-editing";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center  p-2 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          src="/logo.png"
          alt="Thermostat Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
        <ThermostatEditing data={{ temperature: 20, setPointTemp: 20, fanStatus: "low", powerOn: "off", systemMode: "cool", setPointLowerLimit: 10, setPointUpperLimit: 30 }} />
      </main>
    </div>
  );
}
