import React, { useContext, useEffect, useState } from "react";
import { convertTitleCaseToSpaces, useCurrentUser } from "@/lib/utils";
import type { WorkshopWithDetails } from "@/app/types";
import { Share_Tech } from "next/font/google";
import Image from "next/image";
import { CursorContext } from "@/context/cursor-context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import MarqueeContainer from "@/components/common/marquee-container";
import RegisterDialog from "@/components/common/registration-dialog";
import { api } from "@/trpc/react";
import WorkshopBrief from "@/components/workshops/workshop-briefing";
import StaticImg from "../../../public/images/img.png";

const sharetech = Share_Tech({ weight: "400", subsets: ["latin"] });


const WorkshopDetailsBox = ({ work }: { work: WorkshopWithDetails }) => {

  const { CurrentUser } = useCurrentUser();
  const { setIsHovered } = useContext(CursorContext);

  const [regPrice, setRegPrice] = useState(0);
  const [regPlanId, setRegPlanId] = useState("");

  const { data: plan, isLoading: loadingPlan } =
    api.registration.checkUserRegisteration.useQuery(
      {
        userId: CurrentUser?.id ?? "",
        eventId: work?.workshopDetailsId ?? "",
      },
      {
        enabled: !!CurrentUser && !!work,
      },
    );

  const regStatus = !!plan;
  const collegeWork = work?.college_special ?? false;

  useEffect(() => {
    setRegPrice(((work.workshopDetails.regPlans[0]?.price ?? 0) / (CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? 2 : 1)));
    setRegPlanId(work?.workshopDetails.regPlans[0]?.id ?? "");
  }, [work, CurrentUser]);

  return (
    <>
      <div className="relative flex h-full w-full flex-col items-start overflow-y-scroll overscroll-none bg-neutral-900 md:flex-row">
        <Image
          src={
            work.workshopDetails.cover === ""
              ? StaticImg
              : work.workshopDetails.cover
          }
          alt={work.workshopDetails.name}
          width={500}
          height={1080}
          className="sticky top-0 h-96 w-full shrink border-2 border-t-0 border-amber-50 object-cover md:h-screen md:w-[300px] md:border-l-0 md:border-t-2 lg:w-[400px]"
        />
        <div className="relative shrink-0 md:h-screen md:w-full md:max-w-[calc(100vw-364px)] lg:max-w-[calc(100vw-464px)]">
          <div className="space-y-5 overflow-auto overscroll-none p-12 md:pt-44">
            <div className="-mb-2.5 flex flex-wrap gap-2.5">
              {work?.workshopDetails.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-neutral-600 px-4 text-lg font-light uppercase"
                >
                  {convertTitleCaseToSpaces(tag)}
                </span>
              ))}
            </div>
            <div className="text-6xl font-semibold uppercase tracking-wider lg:text-7xl lg:font-bold xl:text-8xl">
              {work.workshopDetails.name}
            </div>
            <pre
              className={`${sharetech.className} max-w-screen-lg text-wrap text-base tracking-tight text-amber-50 lg:text-lg`}
            >
              {work.workshopDetails.description}
            </pre>
            <div className="relative h-12 w-full bg-neutral-900">
              {loadingPlan ||
              work.workshopDetails.description
                .toLowerCase()
                .includes("coming soon") ? (
                <div
                  className={`absolute bottom-0 flex h-12 w-full cursor-none items-center overflow-clip border-2 border-amber-50 bg-amber-50/[0.7] text-2xl uppercase text-neutral-900 md:border-l-0`}
                >
                  <MarqueeContainer
                    text={[
                      "Fetching Results",
                      "Fetching Results",
                      "Fetching Results",
                      "Fetching Results",
                    ]}
                  />
                </div>
              ) : regStatus ? (
                !plan.verified && (
                  <div className="w-fit border-2 bg-amber-50/[0.7] px-5 py-2 text-xl font-normal uppercase text-neutral-900">
                    Your payment is being verified right now
                  </div>
                )
              ) : collegeWork &&
                CurrentUser?.college_name !==
                  "Indian Institute of Technology, Mandi" ? (
                <div
                  className={`absolute bottom-0 flex h-12 w-full cursor-none items-center overflow-clip border-2 border-amber-50 bg-amber-50/[0.7] text-2xl uppercase text-neutral-900 md:border-l-0`}
                >
                  <MarqueeContainer
                    text={[
                      `IIT Mandi students only workshop`,
                      `IIT Mandi students only workshop`,
                      `IIT Mandi students only workshop`,
                      `IIT Mandi students only workshop`,
                    ]}
                  />
                </div>
              ) : (
                <RegisterDialog
                  trigger={
                    <button
                      className="w-full cursor-none overflow-clip"
                      disabled={CurrentUser?.email === ""}
                      onMouseEnter={() => {
                        if (CurrentUser?.email !== "") setIsHovered(true);
                      }}
                      onMouseLeave={() => setIsHovered(false)}
                    >
                      <div
                        className={`absolute bottom-0 flex h-12 w-full cursor-none items-center overflow-clip border-2 border-amber-50 bg-amber-50/[0.7] text-2xl uppercase text-neutral-900 md:border-l-0`}
                      >
                        <MarqueeContainer
                          text={[
                            `register for ${work.workshopDetails.name}${CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? " (50% off for you)" : ""}`,
                            CurrentUser?.email === ""
                              ? "login required to register"
                              : `register for ${work.workshopDetails.name}`,
                            `register for ${work.workshopDetails.name}${CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? " (50% off for you)" : ""}`,
                            CurrentUser?.email === ""
                              ? "login required to register"
                              : `register for ${work.workshopDetails.name}${CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? " (50% off for you)" : ""}`,
                          ]}
                        />
                      </div>
                    </button>
                  }
                  content={
                    <RadioGroup
                      onValueChange={(e) => {
                        setRegPlanId(e.split(" ")[1]!);
                        setRegPrice(parseInt(e.split(" ")[0]!));
                      }}
                      defaultValue={
                        (((work.workshopDetails.regPlans[0]?.price ?? 0) / (CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? 2 : 1)).toString() ??
                          "") +
                        " " +
                        (work.workshopDetails.regPlans[0]?.id ?? "")
                      }
                    >
                      {work.workshopDetails.regPlans.map((reg) => {
                        return (
                          <div
                            key={reg.id}
                            className="mb-2 flex items-center gap-2 px-5"
                          >
                            <RadioGroupItem
                              className="h-8 w-8 rounded-none bg-amber-50/[0.5]"
                              value={(reg.price / (CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? 2 : 1)).toString() + " " + reg.id}
                              key={reg.id}
                            />
                            <Label
                              htmlFor={reg.id}
                              className="flex w-full flex-col p-2"
                            >
                              <div className="flex items-center gap-2">
                                <div className="text-xl font-normal uppercase">
                                  {reg.name} - ₹{(reg.price / (CurrentUser?.college_name === "Indian Institute of Technology, Mandi" ? 2 : 1))}
                                </div>
                                <div className="rounded-full bg-gray-500 px-2 py-0.5 text-sm font-light uppercase">
                                  {reg.labelling}
                                </div>
                              </div>
                              <div
                                className={`${sharetech.className} mt-1 text-base tracking-tight`}
                              >
                                {reg.description}
                              </div>
                            </Label>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  }
                  price={regPrice}
                  regPlanId={regPlanId}
                  eventId={work.workshopDetails.id}
                />
              )}
            </div>
            <div className="grid w-full max-w-screen-xl grid-cols-1 gap-5 pt-12 xl:grid-cols-[50%_auto]">
              <WorkshopBrief data={work} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkshopDetailsBox;
