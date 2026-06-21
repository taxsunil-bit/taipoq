import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getSoundSettings, saveSoundSettings, type SoundSettings } from "@/lib/sound-settings";

export function SoundSettings() {
  const [settings, setSettings] = useState<SoundSettings>(() => getSoundSettings());

  useEffect(() => {
    saveSoundSettings(settings);
  }, [settings]);

  function update(patch: Partial<SoundSettings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Sound Settings</CardTitle>
        <CardDescription>Optional audio feedback using Web Audio. All sounds are off by default.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SettingRow
          id="sound-enabled"
          label="Enable sounds"
          description="Master switch for typing and result sounds."
          checked={settings.soundEnabled}
          onCheckedChange={(v) => update({ soundEnabled: v })}
        />
        <SettingRow
          id="keypress-sound"
          label="Keypress sound"
          description="Soft click on correct keys."
          checked={settings.keypressSound}
          disabled={!settings.soundEnabled}
          onCheckedChange={(v) => update({ keypressSound: v })}
        />
        <SettingRow
          id="error-sound"
          label="Error sound"
          description="Alert when a wrong key is typed."
          checked={settings.errorSound}
          disabled={!settings.soundEnabled}
          onCheckedChange={(v) => update({ errorSound: v })}
        />
        <SettingRow
          id="completion-sound"
          label="Completion sound"
          description="Short chime when result page loads."
          checked={settings.completionSound}
          disabled={!settings.soundEnabled}
          onCheckedChange={(v) => update({ completionSound: v })}
        />
      </CardContent>
    </Card>
  );
}

function SettingRow({
  id,
  label,
  description,
  checked,
  disabled,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card/40 px-4 py-3">
      <div className="min-w-0 flex-1">
        <Label htmlFor={id} className="text-sm font-medium text-foreground">
          {label}
        </Label>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onCheckedChange} />
    </div>
  );
}
