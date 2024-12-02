"use client";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import {
  DaybreakForm,
  DaybreakFormStep,
  DaybreakFormCard,
  DaybreakFormButton,
  DaybreakImageCheckbox,
  DaybreakFormTextarea,
} from "@/components/form";
import {
  BasicInformationValues,
  ContactFormValues,
  basicInformationSchema,
  contactFormSchema,
  ProjectTypeValues,
  projectTypeSchema,
  projectDetailsSchema,
  ProjectDetailsValues,
} from "@/lib/contact/schemas/contact-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";

export default function ContactPage() {
  const basicInformationForm = useForm<BasicInformationValues>({
    resolver: zodResolver(basicInformationSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  function onSubmitBasicInformation(data: BasicInformationValues) {
    console.log(data);
  }

  const projectTypesForm = useForm<ProjectTypeValues>({
    resolver: zodResolver(projectTypeSchema),
    defaultValues: {
      projectTypes: [],
    },
  });

  function onSubmitProjectTypes(data: ProjectTypeValues) {
    console.log(data);
  }

  const projectDetailsForm = useForm<ProjectDetailsValues>({
    resolver: zodResolver(projectDetailsSchema),
    defaultValues: {
      message: "",
      link: "",
    },
  });

  function onSubmitProjectDetails(data: ProjectDetailsValues) {
    console.log(data);
  }

  useEffect(() => {
    const storedData = localStorage.getItem("contact_form_data");

    if (storedData) {
      const data = JSON.parse(storedData);
      basicInformationForm.reset(data.basicInformation);
      projectTypesForm.reset(data.projectTypes);
      projectDetailsForm.reset(data.projectDetails);
    }
  }, [basicInformationForm, projectDetailsForm, projectTypesForm]);

  const cards: DaybreakFormStep[] = [
    {
      id: "step1",
      card: (
        <DaybreakFormCard title="Want to launch your next project?">
          <div className="flex flex-col gap-24">
            <span className="leading-[var(--Spacing-7,28px)]; text-[length:var(--Spacing-4,16px)] font-[450] not-italic text-[color(display-p3_0_0_0)] text-black opacity-70">
              We’re looking for people excited by the possibilities of
              technology, constantly exploring new means of expression and
              highly detailed in their practice.
            </span>
            <div className="flex h-[60px] items-center justify-between self-stretch rounded-2xl border border-solid border-[color(display-p3_0_0_0_/_0.08)] border-[rgba(0,0,0,0.08)] py-2 pl-6 pr-2">
              <span className="text-[length:var(--Spacing-35,14px)] font-[450] not-italic leading-[var(--Spacing-6,24px)] text-[color(display-p3_0_0_0)] text-black opacity-50">
                Send us an email:
              </span>
              <button
                className="flex h-11 items-center justify-center gap-3 rounded-xl p-3 shadow-[0px_32px_100px_0px_color(display-p3_0_0_0_/_0.05)] shadow-[0px_32px_100px_0px_rgba(0,0,0,0.05)] hover:cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText("hello@daybreak.studio");
                }}
              >
                <span className="text-[length:var(--Spacing-35,14px)] font-[450] not-italic leading-[var(--Spacing-6,24px)] text-[color(display-p3_0_0_0)] text-black opacity-50">
                  hello@daybreak.studio
                </span>
                <ClipboardDocumentIcon className="h-5 w-5 text-black opacity-50" />
              </button>
            </div>
          </div>
        </DaybreakFormCard>
      ),
      button: true,
      valid: true,
    },
    {
      id: "step2",
      card: (
        <DaybreakFormCard title="Let’s start with the basics">
          <Form {...basicInformationForm}>
            <form
              onSubmit={basicInformationForm.handleSubmit(
                onSubmitBasicInformation,
              )}
              className="flex flex-col items-start gap-8 self-stretch"
            >
              <FormField
                control={basicInformationForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={basicInformationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="jane@company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DaybreakFormButton
                type="submit"
                disabled={!basicInformationForm.formState.isValid}
              >
                Next
              </DaybreakFormButton>
            </form>
          </Form>
        </DaybreakFormCard>
      ),
      button: false,
      valid: basicInformationForm.formState.isValid,
    },
    {
      id: "step3",
      card: (
        <DaybreakFormCard title="Where would you like our expertise?">
          <Form {...projectTypesForm}>
            <form
              onSubmit={projectTypesForm.handleSubmit(onSubmitProjectTypes)}
              className="flex flex-col items-start gap-8 self-stretch"
            >
              <FormField
                control={basicInformationForm.control}
                name="email"
                render={({ field }) => (
                  <div className="flex flex-col items-start gap-1 self-stretch">
                    <div className="flex items-start gap-1 self-stretch">
                      <FormItem key={"web"}>
                        <FormControl>
                          <div
                            className="relative flex h-[200px] flex-[1_0_0] flex-col items-start gap-2.5 self-stretch rounded-2xl bg-[color(display-p3_1_1_1_/_0.20)] bg-[rgba(255,255,255,0.20)] px-5 py-4"
                            onClick={() => {
                              console.log(field);
                              field.onChange([...(field.value || []), "web"]);
                            }}
                          >
                            <div className="flex w-full items-center justify-between">
                              <label className="flex items-center gap-3">
                                Web Design
                              </label>
                              <Checkbox
                                checked={field.value?.includes("web")}
                              />
                            </div>
                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px]">
                              <Image
                                src="/images/web-design.png"
                                fill
                                unoptimized
                                className="object-cover"
                                alt="web-design"
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div
                            className="relative flex h-[200px] flex-[1_0_0] flex-col items-start gap-2.5 self-stretch rounded-2xl bg-[color(display-p3_1_1_1_/_0.20)] bg-[rgba(255,255,255,0.20)] px-5 py-4"
                            onClick={() => {
                              field.onChange([
                                ...(field.value || []),
                                "product",
                              ]);
                            }}
                          >
                            <div className="flex w-full items-center justify-between">
                              <label className="flex items-center gap-3">
                                Product Design
                              </label>
                              <Checkbox
                                checked={field.value?.includes("product")}
                              />
                            </div>
                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px]">
                              <Image
                                src="/images/product-design.png"
                                fill
                                unoptimized
                                className="object-cover"
                                alt="product-design"
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    </div>
                    <div className="flex items-start gap-1 self-stretch">
                      <FormItem>
                        <FormControl>
                          <div
                            className="relative flex h-[200px] flex-[1_0_0] flex-col items-start gap-2.5 self-stretch rounded-2xl bg-[color(display-p3_1_1_1_/_0.20)] bg-[rgba(255,255,255,0.20)] px-5 py-4"
                            onClick={() => {
                              field.onChange([...(field.value || []), "brand"]);
                            }}
                          >
                            <div className="flex w-full items-center justify-between">
                              <label className="flex items-center gap-3">
                                Brand Design
                              </label>
                              <Checkbox
                                checked={field.value?.includes("brand")}
                              />
                            </div>
                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px]">
                              <Image
                                src="/images/brand-design.png"
                                fill
                                unoptimized
                                className="object-cover"
                                alt="brand-design"
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                      <FormItem>
                        <FormControl>
                          <div
                            className="relative flex h-[200px] flex-[1_0_0] flex-col items-start gap-2.5 self-stretch rounded-2xl bg-[color(display-p3_1_1_1_/_0.20)] bg-[rgba(255,255,255,0.20)] px-5 py-4"
                            onClick={() => {
                              field.onChange([
                                ...(field.value || []),
                                "motion",
                              ]);
                            }}
                          >
                            <div className="flex w-full items-center justify-between">
                              <label className="flex items-center gap-3">
                                Motion Work
                              </label>
                              <Checkbox
                                checked={field.value?.includes("motion")}
                              />
                            </div>
                            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[14px]">
                              <Image
                                src="/images/motion-work.png"
                                fill
                                unoptimized
                                className="object-cover"
                                alt="motion-work"
                              />
                            </div>
                          </div>
                        </FormControl>
                      </FormItem>
                    </div>
                  </div>
                )}
              />
              <DaybreakFormButton
                type="submit"
                disabled={projectTypesForm.formState.isSubmitting}
              >
                Next
              </DaybreakFormButton>
            </form>
          </Form>
        </DaybreakFormCard>
      ),
      valid: projectTypesForm.formState.isValid,
    },
    {
      id: "step4",
      card: (
        <DaybreakFormCard title="Do you have any details to share about the project?">
          <Form {...projectDetailsForm}>
            <form
              onSubmit={projectDetailsForm.handleSubmit(onSubmitProjectDetails)}
              className="flex flex-col items-start gap-8 self-stretch"
            >
              <FormField
                control={projectDetailsForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us about your project</FormLabel>
                    <FormControl>
                      <DaybreakFormTextarea
                        placeholder="Share your vision, goals, and any specific requirements..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={projectDetailsForm.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Got a website or portfolio to share?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://your-website.com"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DaybreakFormButton
                type="submit"
                disabled={projectDetailsForm.formState.isSubmitting}
              >
                {projectDetailsForm.formState.isSubmitting ? (
                  <span className="flex items-center gap-2">
                    Sending your message...
                  </span>
                ) : (
                  "Let's create something amazing"
                )}
              </DaybreakFormButton>
            </form>
          </Form>
        </DaybreakFormCard>
      ),
      valid: projectDetailsForm.formState.isValid,
    },
    {
      id: "step5",
      card: (
        <DaybreakFormCard
          title={`Thank you ${basicInformationForm.getValues("fullName") || "Friend"} has been submitted. We will reach out to you shortly.`}
        >
          <div className="flex flex-col gap-24">
            <span className="leading-[var(--Spacing-7,28px)]; text-[length:var(--Spacing-4,16px)] font-[450] not-italic text-[color(display-p3_0_0_0)] text-black opacity-70">
              Your form has been submitted. We will reach out to you shortly.
            </span>
          </div>
        </DaybreakFormCard>
      ),
      button: false,
      valid: true,
    },
  ];

  return (
    <div
      className="fixed inset-0 z-0"
      style={{
        background:
          "linear-gradient(0deg, rgba(240,240,220,1) 0%, rgba(249,221,213,1) 25%, rgba(236,236,240,1) 75%)",
      }}
    >
      <DaybreakForm cards={cards} />
    </div>
  );
}
