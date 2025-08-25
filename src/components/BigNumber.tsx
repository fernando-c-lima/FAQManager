
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BigNumberProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function BigNumber({
  title,
  value,
  icon,
  className,
  delay = 0,
}: BigNumberProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className={cn("overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.h3 
                className="text-2xl font-bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
              >
                {value}
              </motion.h3>
            </div>
            {icon && (
              <div className="text-primary bg-primary/10 p-2 rounded-full">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
