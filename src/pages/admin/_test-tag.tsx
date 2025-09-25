import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TagField } from "@/components/ui/tag-field";
import { useState } from "react";

export default function TestTagPage() {
  const [multipleTags, setMultipleTags] = useState<string[]>([]);
  const [singleTag, setSingleTag] = useState<string[]>([]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">TagField Component Test</h1>
        <p className="text-muted-foreground">
          Test the TagField component with different configurations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Multiple Tags Test */}
        <Card>
          <CardHeader>
            <CardTitle>Multiple Tags (Posts/Announcements)</CardTitle>
            <CardDescription>
              Select or create multiple tags. This is the default mode.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TagField
              value={multipleTags}
              onChange={setMultipleTags}
              multiple={true}
              placeholder="Select or create tags..."
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Tags:</p>
              <div className="flex flex-wrap gap-2">
                {multipleTags.length > 0 ? (
                  multipleTags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No tags selected
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setMultipleTags([])}
              className="w-full"
            >
              Clear All
            </Button>
          </CardContent>
        </Card>

        {/* Single Tag Test */}
        <Card>
          <CardHeader>
            <CardTitle>Single Tag (Directories)</CardTitle>
            <CardDescription>
              Select or create a single tag only.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <TagField
              value={singleTag}
              onChange={setSingleTag}
              multiple={false}
              placeholder="Select or create a tag..."
            />
            <div className="space-y-2">
              <p className="text-sm font-medium">Selected Tag:</p>
              <div className="flex flex-wrap gap-2">
                {singleTag.length > 0 ? (
                  singleTag.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    No tag selected
                  </span>
                )}
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setSingleTag([])}
              className="w-full"
            >
              Clear
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Debug Info */}
      <Card>
        <CardHeader>
          <CardTitle>Debug Information</CardTitle>
          <CardDescription>Current state values for testing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Multiple Tags State:</p>
              <pre className="text-xs bg-muted p-2 rounded mt-1">
                {JSON.stringify(multipleTags, null, 2)}
              </pre>
            </div>
            <div>
              <p className="text-sm font-medium">Single Tag State:</p>
              <pre className="text-xs bg-muted p-2 rounded mt-1">
                {JSON.stringify(singleTag, null, 2)}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
