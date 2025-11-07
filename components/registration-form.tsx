"use client";

import type React from "react";

import { useState, useEffect, useCallback, useRef, RefObject } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle,
  Ticket,
  Download,
  Loader2,
  Loader,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { getRegistration, register } from "@/functions/registeration";
import { CustomCombobox } from "./ui/combobox";
import { COURSES, DIVISIONS, SCHOOLS } from "@/lib/conts";
import Image from "next/image";
import { createNPId } from "@/lib/utils";
import { Registration } from "@/lib/generated/prisma/client";
import { QRCodeCanvas } from "qrcode.react";
import { downloadCanvas } from "@/lib/ticket";

interface FormData {
  name: string;
  mobile: string;
  dob: string;
  class: "PLUS_ONE" | "PLUS_TWO" | string;
  division: string;
  school: string;
}

interface FormErrors {
  [key: string]: string;
}

type RegistrationData = Registration;

export function RegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    dob: "",
    class: "",
    division: "",
    school: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [checkStatus, setCheckStatus] = useState<
    "idle" | "checking" | "found" | "not_found" | "error"
  >("idle");
  const [successMessage, setSuccessMessage] = useState("");
  const [ticketId, setTicketId] = useState("");
  const [ticketData, setTicketData] = useState<RegistrationData | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);

  // Debounce function
  const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedMobile = useDebounce(formData.mobile, 500);
  const debouncedDob = useDebounce(formData.dob, 500);

  // Check registration when mobile and DOB are filled
  const checkRegistration = useCallback(async (mobile: string, dob: string) => {
    if (!mobile || !dob) {
      setCheckStatus("idle");
      setIsFormReady(false);
      return;
    }

    // Validate mobile format
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile.replace(/\D/g, ""))) {
      return;
    }

    setIsChecking(true);
    setCheckStatus("checking");

    try {
      const registration = await getRegistration(undefined, { mobile, dob });

      if (registration) {
        setCheckStatus("found");
        setTicketData(registration);
        // Pre-fill form with existing data
        setFormData((prev) => ({
          ...prev,
          ...registration,
          mobile: mobile, // Keep the mobile they entered
          dateOfBirth: dob, // Keep the DOB they entered
        }));
      } else {
        setCheckStatus("not_found");
        setIsFormReady(true);
      }
    } catch (error) {
      setCheckStatus("error");
      setIsFormReady(true);
      console.error("Check registration error:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  // Effect to trigger registration check when debounced values change
  useEffect(() => {
    if (debouncedMobile && debouncedDob) {
      checkRegistration(debouncedMobile, debouncedDob);
    }
  }, [debouncedMobile, debouncedDob, checkRegistration]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate mobile (10 digits) - only if not already found
    if (checkStatus !== "found") {
      const mobileRegex = /^[0-9]{10}$/;
      if (!formData.mobile.trim()) {
        newErrors.mobile = "Mobile number is required";
      } else if (!mobileRegex.test(formData.mobile.replace(/\D/g, ""))) {
        newErrors.mobile = "Mobile number must be 10 digits";
      }
    }

    // Validate date of birth - only if not already found
    if (checkStatus !== "found" && !formData.dob) {
      newErrors.dateOfBirth = "Date of birth is required";
    }

    // Validate other fields
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (
      !formData.class.trim() &&
      formData.class !== "PLUS_ONE" &&
      formData.class !== "PLUS_TWO"
    ) {
      newErrors.class = "Class is required";
    }
    if (!formData.division) {
      newErrors.division = "Division is required";
    }

    if (!formData.school) {
      newErrors.school = "School is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await register({
        ...formData,
        class: formData.class as "PLUS_ONE" | "PLUS_TWO",
      });

      if (!response) {
        throw new Error("Registration failed");
      }
      setSubmitStatus("success");
      setSuccessMessage(`Registration successful!`);
      setTicketData(response);
    } catch (error) {
      setSubmitStatus("error");
      console.error("Registration error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGetTicket = () => {
    setShowTicket(true);
  };

  const downloadTicket = async () => {
    try {
      if (!ticketRef) return;

      setDownloading(true);

      await downloadCanvas(
        ticketRef as RefObject<HTMLDivElement>,
        `hss_gala_ticket_${ticketData!.name}_${createNPId(ticketData!.id)}`
      );
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Error downloading"
      );
    } finally {
      setDownloading(false);
    }
  };
  const shareTicket = async () => {
    try {
      if (!ticketRef) return;
      setDownloading(true);

      // Generate the image from canvas or element
      const url = (await downloadCanvas(
        ticketRef as RefObject<HTMLDivElement>,
        `hss_gala_ticket_${ticketData!.name}_${createNPId(ticketData!.id)}`,
        true
      )) as string;

      // Convert the image URL (base64) to a Blob for sharing
      const response = await fetch(url);
      const blob = await response.blob();
      const file = new File([blob], "ticket.png", { type: "image/png" });

      // Check if the device supports sharing files
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "HSS Gala Ticket 🎟️",
          text: `Here’s my ticket for the Higher Secondary Student's Gala Event!\nName: ${
            ticketData!.name
          }\nID: ${createNPId(ticketData!.id)}\n\nRegister here: ${
            window.location.href
          }`,
          files: [file],
        });
        console.log("Shared successfully!");
      } else {
        // Fallback — open image in new tab
        window.open(url, "_blank");
        alert(
          "Your browser doesn’t support native sharing. Ticket opened instead."
        );
      }
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : "Error sharing ticket"
      );
    } finally {
      setDownloading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      mobile: "",
      dob: "",
      class: "",
      division: "",
      school: "",
    });
    setCheckStatus("idle");
    setIsFormReady(false);
    setTicketData(null);
    setTicketId("");
    setShowTicket(false);
    setSubmitStatus("idle");
  };

  return (
    <Card className="p-8 border border-border max-w-2xl mx-auto bg-gray-50/50 backdrop-blur-xs">
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-3 mb-4">
          <Ticket className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-secondary">Get Your Ticket</h1>
        </div>
        <p className="text-foreground/60">
          Let’s meet at the Gala! Register now.
        </p>
      </div>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-green-900">
              Registration Successful!
            </h3>
            <p className="text-green-800 text-sm mt-1">{successMessage}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="mt-2"
            >
              Register Different student
            </Button>
          </div>
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900">Registration Failed</h3>
            <p className="text-red-800 text-sm mt-1">
              Please try again or contact support.
            </p>
          </div>
        </div>
      )}

      {checkStatus === "found" && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-blue-900">Already Registered!</h3>
            <p className="text-blue-800 text-sm mt-1">
              We found your registration details. You can view your ticket
              below.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={resetForm}
              className="mt-2"
            >
              Register Different User
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mobile and DOB Fields - Always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile Number *</Label>
            <Input
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleInputChange}
              placeholder="Enter your mobile number"
              maxLength={10}
              disabled={checkStatus === "found"}
              pattern="[0-9]{10}"
              inputMode="tel"
              className={errors.mobile ? "border-red-500" : ""}
            />
            {errors.mobile && (
              <p className="text-sm text-red-600">{errors.mobile}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dob"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleInputChange}
              disabled={checkStatus === "found"}
              className={errors.dob ? "border-red-500" : ""}
            />
            {errors.dob && (
              <p className="text-sm text-red-600">{errors.dateOfBirth}</p>
            )}
          </div>
        </div>

        {/* Loading indicator for registration check */}
        {checkStatus === "checking" && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking registration...
          </div>
        )}

        {/* Additional form fields - shown when ready for registration or when data is found */}
        {(isFormReady || checkStatus === "found") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="space-y-4 pt-4 border-t border-border"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  readOnly={checkStatus === "found"}
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-600">{errors.name}</p>
                )}
              </div>
              {/* <div className="space-y-2 w-full">
                <Label htmlFor="course">Course *</Label>
                <Select
                  value={formData.course}
                  onValueChange={(value) => handleSelectChange("course", value)}
                  disabled={checkStatus === "found"}
                >
                  <SelectTrigger
                    id="course"
                    className={errors.course ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((crs) => (
                      <SelectItem key={crs} value={crs.toUpperCase()}>
                        {crs}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.course && (
                  <p className="text-sm text-red-600">{errors.course}</p>
                )}
              </div> */}
              <div className="space-y-2 w-full">
                <Label htmlFor="class">Class *</Label>
                <Select
                  value={formData.class}
                  onValueChange={(value) => handleSelectChange("class", value)}
                  disabled={checkStatus === "found"}
                >
                  <SelectTrigger
                    id="class"
                    className={errors.class ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLUS_ONE">Plus One</SelectItem>
                    <SelectItem value="PLUS_TWO">Plus Two</SelectItem>
                  </SelectContent>
                </Select>
                {errors.class && (
                  <p className="text-sm text-red-600">{errors.class}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 w-full">
                <Label htmlFor="division">Division *</Label>
                <Select
                  value={formData.division}
                  onValueChange={(value) =>
                    handleSelectChange("division", value)
                  }
                  disabled={checkStatus === "found"}
                >
                  <SelectTrigger
                    id="division"
                    className={errors.division ? "border-red-500" : ""}
                  >
                    <SelectValue placeholder="Select division" />
                  </SelectTrigger>
                  <SelectContent>
                    {DIVISIONS.map((div) => (
                      <SelectItem key={div} value={div}>
                        {div}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.division && (
                  <p className="text-sm text-red-600">{errors.division}</p>
                )}
              </div>
              <div className="space-y-2">
                <CustomCombobox
                  value={formData.school}
                  onValueChange={(value) => handleSelectChange("school", value)}
                  options={SCHOOLS.map((school) => school.name)}
                  placeholder="Select school or type custom value"
                  disabled={checkStatus === "found"}
                  error={!!errors.school}
                  label="School *"
                  emptyMessage="No schools found. Type to add a custom school."
                />
                {errors.school && (
                  <p className="text-sm text-red-600">{errors.school}</p>
                )}
              </div>
            </div>

            {/* Submit button - only show if not already registered */}
            {checkStatus !== "found" && submitStatus !== "success" && (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg font-semibold mt-4"
              >
                {isSubmitting ? "Registering..." : "Complete Registration"}
              </Button>
            )}
          </motion.div>
        )}

        {checkStatus !== "found" && submitStatus !== "success" && (
          <p className="text-sm text-foreground/60 text-center">
            By registering, you agree to our terms and conditions
          </p>
        )}
      </form>

      {/* Get Ticket Button - Show after successful registration or found registration */}
      {(submitStatus === "success" || checkStatus === "found") &&
        !showTicket && (
          <div className="space-y-4 mt-6">
            <Button
              onClick={handleGetTicket}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Get Your Ticket
            </Button>
          </div>
        )}

      {/* Ticket Display */}
      {showTicket && ticketData && (
        <div className="space-y-4 mt-6">
          <div
            className="mx-auto lg:w-[436.24px] lg:h-[774.9px] w-[255.36px] h-[453.6px] sm:w-[329.84px] md:w-[383.04px] md:h-[680.4px] sm:h-[585.9.6px] relative "
            // style={{
            //   position: "relative",
            //   width: `${1688 * 0.25}px`,
            //   height: `${3000 * 0.25}px`,
            // }}
          >
            <div
              ref={ticketRef}
              className="mx-auto lg:transform-[scale(0.41)] transform-[scale(0.24)] sm:transform-[sacle(0.31)] md:transform-[scale(0.36)]"
              style={{
                position: "relative",
                width: "1064px",
                height: "1890px",
                transformOrigin: "top left",
              }}
            >
              <Image
                src="/ticket.png"
                width={1064}
                height={1890}
                priority
                alt="ticket"
                className="h-full w-full"
              />
              <div className=" absolute inset-x-0 top-[58%] w-full mx-auto ">
                <div className="w-[38%] mx-auto flex flex-col gap-3">
                  <div
                    style={{
                      height: "auto",
                      margin: "0 auto",
                      maxWidth: "100%",
                      width: "100%",
                    }}
                    className="rounded-md p-2"
                  >
                    <QRCodeCanvas
                      style={{
                        height: "auto",
                        maxWidth: "100%",
                        width: "100%",
                      }}
                      bgColor="transparent"
                      level="Q"
                      size={844}
                      value={createNPId(ticketData?.id || 500)}
                    />
                  </div>
                  <div className="font-sans font-medium  flex flex-col leading-tight text-center">
                    <h4 className="text-[#b61c1c] text-[50px]">
                      {createNPId(ticketData?.id || 500)}
                    </h4>
                    <h2 className="text-[58px] text-black uppercase leading-tight">
                      {ticketData?.name || "MUHAMMED SUHAIL A"}
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          <div className="text-center mt-6 flex gap-2 justify-center items-center flex-wrap">
            <Button
              onClick={downloadTicket}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Ticket
            </Button>
            <Button
              onClick={shareTicket}
              className="bg-green-600 hover:bg-green-500/90"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Ticket
            </Button>
          </div>
        </div>
      )}
      {downloading && (
        <div className="fixed bg-white/50 inset-0 z-[999]">
          <div className="flex items-center justify-center h-screen">
            <Loader size={50} className="animate-spin text-primary" />
          </div>
        </div>
      )}
    </Card>
  );
}
