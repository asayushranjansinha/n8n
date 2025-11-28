import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Settings2, Sparkles, Zap } from "lucide-react";
import { ReactNode } from "react";

export function FeaturesSection() {
  return (
    <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="@container mx-auto w-full max-w-5xl">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Built for automation enthusiasts
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connect apps, automate workflows, and streamline your business
            operations effortlessly.
          </p>
        </div>
        <div className="@min-4xl:max-w-full @min-4xl:grid-cols-3 mx-auto mt-8 grid max-w-sm gap-6 *:text-center md:mt-16">
          <Card className="group shadow-black-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Zap className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Custom Workflows</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Create automated workflows tailored to your needs, connecting
                hundreds of apps and services seamlessly.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-black-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Settings2 className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">Full Control</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Manage triggers, actions, and integrations with complete
                flexibility for maximum efficiency.
              </p>
            </CardContent>
          </Card>

          <Card className="group shadow-black-950/5">
            <CardHeader className="pb-3">
              <CardDecorator>
                <Sparkles className="size-6" aria-hidden />
              </CardDecorator>
              <h3 className="mt-6 font-medium">AI-Powered Automation</h3>
            </CardHeader>

            <CardContent>
              <p className="text-sm">
                Leverage AI integrations to enhance your workflows and make
                smarter, faster decisions automatically.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

const CardDecorator = ({ children }: { children: ReactNode }) => (
  <div
    aria-hidden
    className="relative mx-auto size-36 mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"
  >
    <div className="absolute inset-0 [--border:black] dark:[--border:white] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[24px_24px] opacity-10" />
    <div className="bg-background absolute inset-0 m-auto flex size-12 items-center justify-center border-t border-l">
      {children}
    </div>
  </div>
);
