import FetchDataSteps from "@/components/tutorial/fetch-data-steps";
import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex flex-row w-full">

        {/* Meldingen side page */}
        <div className=" flex flex-col basis-1/4 p-4 bg-pink-100 rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
            <div className="flex flex-row justify-between">
                <div className="text-2xl font-bold left">Meldingen</div>
                <Image
                    src="/bell.png"
                    alt="Bell Icon"
                    height={15}
                    width={15}
                    className="right"
                />
            </div>

            {/* This should be changed to dynamic notifications (meldingen) */}
            <div className="flex flex-col my-2">
                {/* one single notification (melding) */}
                <div className="flex flex-row my-2">
                    <Image
                        src="/mock-picture.webp"
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                    <div className="text-xs mx-2"> you got a message from ...</div>
                </div>

                {/* one single notification (melding) */}
                <div className="flex flex-row my-2">
                    <Image
                        src="/mock-picture.webp"
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                    <div className="text-xs mx-2"> you got a message from ...</div>
                </div>
            </div>
        </div>

        <div className="flex flex-col ">
            <div className="basis-1/2 p-4 flex flex-row items-left rounded-lg mt-4 mb-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">
                {/* Profile Image */}
                <div className="w-full h-auto overflow-hidden rounded-lg mb-4">
                    <Image
                        src="/mock-picture.webp"
                        alt="Profile Picture"
                        width={32}
                        height={32}
                        className="rounded-full border border-gray-500"
                    />
                </div>
                {/* Profile Text Content */}
                <div
                    className="relative w-3/4 p-8 rounded-lg bg-gradient-to-b from-red-700 to-pink-950 text-white shadow-lg">
                    <div className="text-pretty">
                        <h2 className="text-2xl font-bold">Jara, 25 jaar</h2>
                        <p className="mt-2">Meer informatie over Jara. Hobbies, interesses, relatie status, wat ze hoopt te
                            vinden op de applicatie, hoe ze zichzelf voelt op dit moment</p>
                        <div className="mt-4 text-3xl">😍</div>
                    </div>
                </div>
            </div>
        </div>
        <div className="basis-1/4 p-4 bg-pink-100 rounded-lg rounded-lg m-4 bg-gradient-to-b from-[#FFDFDB] to-[#FFAB9F]">03</div>
    </div>
  );
}
