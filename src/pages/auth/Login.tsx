import { useNavigate } from "raviger";
import { useCallback } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import AbhaAddressFlow from "@/components/auth/AbhaAddressFlow";
import AbhaNumberOtpFlow from "@/components/auth/AbhaNumberOtpFlow";
import HandleExistingAbhaAddress from "@/components/auth/HandleExistingAbha";
import MobileNumberOtpFlow from "@/components/auth/MobileNumberOtpFlow";

import useMultiStepForm, { InjectedStepProps } from "@/hooks/useMultiStepForm";

import { DEFAULT_AUTH_METHOD } from "@/common/constants";

import {
  AuthFlowTypes,
  AuthMode,
  AuthModes,
  FormMemory,
  INITIAL_AUTH_FORM_VALUES,
  SendOtpRequest,
  VerifyOtpResponse,
} from "@/types/auth";

const LoginAbha = () => {
  const { currentStep } = useMultiStepForm<FormMemory>(
    [
      {
        id: "login",
        element: <Login {...({} as LoginProps)} />,
      },
      {
        id: "handle-existing-abha",
        element: <HandleExistingAbha {...({} as HandleExistingAbhaProps)} />,
      },
    ],
    INITIAL_AUTH_FORM_VALUES,
  );

  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      <div className="bg-primary-500 flex-1"></div>
      <div className="md:w-1/2 w-full flex justify-center items-center my-8">
        <div className="w-full max-w-[400px]">{currentStep}</div>
      </div>
    </div>
  );
};

export default LoginAbha;

type LoginProps = InjectedStepProps<FormMemory>;

const { MOBILE_NUMBER, ABHA_NUMBER, ABHA_ADDRESS } = AuthModes;
const { LOGIN } = AuthFlowTypes;

const Login = ({ memory, setMemory, goTo }: LoginProps) => {
  const navigate = useNavigate();

  const onVerifyOtpSuccess = useCallback(
    (data: VerifyOtpResponse, sendOtpContext?: SendOtpRequest) => {
      setMemory((prev) => ({
        ...prev,
        verifySystem: sendOtpContext?.verify_system || DEFAULT_AUTH_METHOD,
        transactionId: data.transaction_id,
        existingAbhaAddresses: data.users,
      }));

      goTo("handle-existing-abha");
    },
    [setMemory, goTo],
  );

  const handleTabChange = (value: string) => {
    setMemory((prev) => ({
      ...prev,
      mode: value as AuthMode,
    }));
  };

  return (
    <Card className="mx-4">
      <CardHeader className="space-y-1 px-4">
        <CardTitle className="text-2xl font-bold">Login to ABHA</CardTitle>
        <CardDescription>Select your preferred login method.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue={MOBILE_NUMBER}
          value={memory?.mode ?? MOBILE_NUMBER}
          onValueChange={handleTabChange}
        >
          <ScrollArea>
            <TabsList className="flex w-full">
              <TabsTrigger className="flex-1" value={MOBILE_NUMBER}>
                Mobile
              </TabsTrigger>
              <TabsTrigger className="flex-1" value={ABHA_NUMBER}>
                ABHA Number
              </TabsTrigger>
              <TabsTrigger className="flex-1" value={ABHA_ADDRESS}>
                ABHA Address
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <TabsContent value={MOBILE_NUMBER}>
            <MobileNumberOtpFlow
              flowType={LOGIN}
              transactionId={memory?.transactionId}
              setMemory={setMemory}
              onVerifyOtpSuccess={onVerifyOtpSuccess}
            />
          </TabsContent>

          <TabsContent value={ABHA_NUMBER}>
            <AbhaNumberOtpFlow
              flowType={LOGIN}
              transactionId={memory?.transactionId}
              setMemory={setMemory}
              onVerifyOtpSuccess={onVerifyOtpSuccess}
            />
          </TabsContent>

          <TabsContent value={ABHA_ADDRESS}>
            <AbhaAddressFlow
              flowType={LOGIN}
              transactionId={memory?.transactionId}
              setMemory={setMemory}
              onVerifyOtpSuccess={onVerifyOtpSuccess}
            />
          </TabsContent>

          <div className="mt-4 text-sm text-center text-gray-500">
            <span>Don't have an account? </span>
            <Button
              variant="link"
              className="h-auto p-0"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

type HandleExistingAbhaProps = InjectedStepProps<FormMemory>;

const HandleExistingAbha = ({ memory, goTo }: HandleExistingAbhaProps) => {
  return (
    <HandleExistingAbhaAddress flowType={LOGIN} memory={memory} goTo={goTo} />
  );
};
