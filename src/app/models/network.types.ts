export type ModuleId =
  | 'osi-tcpip'
  | 'ip-subnetting'
  | 'switching-vlan'
  | 'routing-gateway'
  | 'app-protocols'
  | 'security-firewall';

export type TabMode = 'learn' | 'quiz' | 'labs' | 'tools' | 'docker';

export interface NetworkModule {
  id: ModuleId;
  title: string;
  badge: string;
  icon: string;
  shortDesc: string;
  color: string;
  objectives: string[];
  keyConcepts: {
    term: string;
    description: string;
    example?: string;
  }[];
  theorySections: {
    title: string;
    content: string;
    bulletPoints?: string[];
    packetDiagram?: string[];
  }[];
}

export interface Question {
  id: string;
  moduleId: ModuleId;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  rfcOrStandard?: string;
  category: string;
}

export interface TopologyNode {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'pc' | 'server' | 'firewall';
  ip?: string;
  mask?: string;
  gateway?: string;
  mac?: string;
  vlan?: number;
  status: 'online' | 'misconfigured' | 'offline';
  x: number; // percentage
  y: number; // percentage
}

export interface TopologyLink {
  from: string;
  to: string;
  label?: string;
  active: boolean;
}

export interface LabTask {
  id: string;
  description: string;
  hint: string;
  isCompleted: boolean;
}

export interface LabScenario {
  id: string;
  moduleId: ModuleId;
  title: string;
  badge: string;
  difficulty: 'Kolay' | 'Orta' | 'Zor';
  estimatedTime: string;
  description: string;
  goal: string;
  topology: {
    nodes: TopologyNode[];
    links: TopologyLink[];
  };
  tasks: LabTask[];
  cliDevices: {
    id: string;
    name: string;
    type: 'router' | 'switch' | 'pc' | 'server';
    prompt: string;
    helpCommands: string[];
  }[];
  initialConfigSummary: string;
  expectedCommandsOrFix: string;
  solutionWalkthrough: string[];
}
